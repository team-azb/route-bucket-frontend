import { useState, useEffect, FunctionComponent } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import L, { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import axios from 'axios'
import 'leaflet/dist/leaflet.css';

const limeOptions: {color: string} = { color: 'lime' }

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
    positions: LatLng[],
    route: string,
    setPositions: React.Dispatch<React.SetStateAction<LatLng[]>>
}

//Polylineコンポーネントのpropsの型
type PolylineProps = {
    polyline: LatLngExpression[],
    route: string,
    setPositions: React.Dispatch<React.SetStateAction<LatLng[]>>
}

//axiosのレスポンスデータのpointの型
type ResponsePoint = {
    latitude: number,
    longitude: number
}

//axiosからのレスポンスのデータのインターフェース
interface Response{
    points: ResponsePoint[],
    message: string
}

//Todo: 別ファイルに移動する
async function patchAdd(latitude: number, longitude: number, position: number, route: string){
    const payload = {
        coord:{
            latitude: latitude,
            longitude: longitude
        }
    }
    let res;
    try {
        res = await axios.patch<Response>(`/routes/${route}/add/${position}`, payload);
        return res
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', async (e: LeafletMouseEvent)=>{
        const res = await patchAdd(e.latlng.lat, e.latlng.lng, props.positions.length, props.route);
        if(res){
            props.setPositions(res.data.points.map((position: ResponsePoint) => new LatLng(position.latitude, position.longitude)));
        }
    })
    return null;
}

function RouteEditor(props: any): JSX.Element{
    const [positions, setPositions] = useState<LatLng[]>([]);

    //Mapのルート変更時にルートを取得してpositionsを変更する
    useEffect(() => {       
        async function getRoute(){
            const res = await axios.get(`/routes/${props.route}`);
            setPositions(res.data.polyline);
        }
        try {
            getRoute();
        } catch (error) {
            console.error(error);
        }
    }, [props.route]);

    //Todo: コンポーネントにして、別ファイルに移動
    const Markers: JSX.Element[] = positions.map((pos: LatLng, idx: number): JSX.Element => {
        async function patchDelete(pos: number){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>(`/routes/${props.route}/remove/${pos}`);
                setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
            } catch (error) {
                if(error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
        }

        return (
            <Marker
                position={[pos.lat, pos.lng]}
                key={nanoid()}
                eventHandlers={{click: ()=>{
                    patchDelete(idx)}
                }} //todo: ここの関数を一つにまとめたい
            >
            </Marker>
        )
    })

    //Todo: stateにする
    const polyline: LatLngExpression[] = positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng])

    //Todo: 別ファイルに移動する
    const Polylines: FunctionComponent<PolylineProps> = (props: PolylineProps) => {
        if(props.polyline.length){
            let polylines: JSX.Element[] = new Array(props.polyline.length - 1);
            for(let idx = 0; idx < props.polyline.length - 1; idx++){
                polylines[idx] = (
                    <Polyline
                        pathOptions={limeOptions} 
                        positions={[polyline[idx], polyline[idx + 1]]}
                        key={nanoid()}
                        eventHandlers={{click: 
                            async (event: L.LeafletMouseEvent)=>{
                                L.DomEvent.stopPropagation(event) //clickLayerに対してクリックイベントを送らない
                                const res = await patchAdd(event.latlng.lat, event.latlng.lng, idx + 1, props.route)
                                if(res){
                                    props.setPositions(res.data.points.map((position: ResponsePoint) => new LatLng(position.latitude, position.longitude)));
                                }
                            }
                        }} 
                    />
                )
            }
            return(
                <>
                {polylines}
                </>
            )
        }else{
            return null
        }
    }

    function onClickClearHandler(): void{
        //Todo: setPositionsは関数に含めずresをreturnする関数に書き直す & 別ファイルに移動
        async function patchClear(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>(`/routes/${props.route}/clear/`);
                setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
            } catch (error) {
                if(error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
            
        }
        patchClear();
    }

    function onClickUndoHandler(): void{
        //Todo: setPositionsは関数に含めずresをreturnする関数に書き直す & 別ファイルに移動
        async function patchUndo(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>(`/routes/${props.route}/undo/`);
                setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
            } catch (error) {
                if(error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
        }
        patchUndo();
    }

    function onClickRedoHandler(): void{
        //Todo: setPositionsは関数に含めずresをreturnする関数に書き直す & 別ファイルに移動
        async function patchRedo(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>(`/routes/${props.route}/redo/`);
                setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
            } catch (error) {
                if(error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
        }
        patchRedo();
    }

    return(
        <>
        <p>現在のルート: {props.route}</p>
        <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Markers}
            <Polylines polyline={polyline} route={props.route} setPositions={setPositions}/>
        <ClickLayer 
            route={props.route}
            positions={positions}
            setPositions={setPositions}
        />
        </MapContainer>
        {/* Todo undoできない時はボタンをdisabledにする */}
        <button onClick={onClickUndoHandler}>undo</button>
        {/* Todo redoできない時はボタンをdisabledにする */}
        <button onClick={onClickRedoHandler}>redo</button>
        <button onClick={onClickClearHandler}>clear</button>
        </>
    )
}

export default RouteEditor;