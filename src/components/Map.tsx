import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import axios from 'axios'
import 'leaflet/dist/leaflet.css';

const limeOptions: {color: string} = { color: 'lime' }

//Todo: interface使うようにする
type ClickLayerProps = {
    positions: LatLng[],
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
  
function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', (e: LeafletMouseEvent)=>{
        async function patchAdd(){
            const payload = {
                coord:{
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }
            }
            try {
                const res = await axios.patch<Response>('/routes/'+props.route+'/add/'+props.positions.length, payload);
                props.setPositions(res.data.points.map((position: ResponsePoint) => new LatLng(position.latitude, position.longitude)));
            } catch (error) {
                if(error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
        }
        patchAdd()
    })
    return null;
}

function Map(props: any){
    const [positions, setPositions] = useState<LatLng[]>([]);

    //Mapのルート変更時にルートを取得してpositionsを変更する
    useEffect(() => {       
        async function getRoute(){
            const res = await axios.get('/routes/'+props.route);
            setPositions(res.data.polyline);
        }
        try {
            getRoute();
        } catch (error) {
            console.error(error);
        }
    }, [props.route]);

    const Markers: JSX.Element[] = positions.map((pos: LatLng): JSX.Element => {
        return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
    })

    const polyline: LatLngExpression[] = positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng])

    function onClickClearHandler(): void{
        async function patchClear(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>('/routes/'+props.route+'/clear/');
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
        async function patchUndo(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>('/routes/'+props.route+'/undo/');
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
        async function patchRedo(){
            //Todo try/catch使わずに.catchで書き直す
            try {
                const res = await axios.patch<Response>('/routes/'+props.route+'/redo/');
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
            {Markers}
            <Polyline pathOptions={limeOptions} positions={polyline}/>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        <ClickLayer route={props.route} positions={positions} setPositions={setPositions}/>
        </MapContainer>
        {/* Todo undoできない時はボタンをdisabledにする */}
        <button onClick={onClickUndoHandler}>undo</button>
        {/* Todo redoできない時はボタンをdisabledにする */}
        <button onClick={onClickRedoHandler}>redo</button>
        <button onClick={onClickClearHandler}>clear</button>
        </>
    )
}

export default Map;