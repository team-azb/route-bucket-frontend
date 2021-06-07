import { useState, useEffect, FunctionComponent } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import L, { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import { getRoute, patchAdd, patchDelete, patchUndo, patchRedo, patchClear } from '../api/route'
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

function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', async (e: LeafletMouseEvent)=>{
        const res = await patchAdd(e.latlng.lat, e.latlng.lng, props.positions.length, props.route);
        if(res){
            props.setPositions(res.data.points.map((position) => new LatLng(position.latitude, position.longitude)));
        }
    })
    return null;
}

function RouteEditor(props: any): JSX.Element{
    const [positions, setPositions] = useState<LatLng[]>([]);
    const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

    //Mapのルート変更時にルートを取得してpositionsを変更する
    useEffect(() => {       
        let unmounted = false;
        (async function(){
            const res = await getRoute(props.route)
            if(res && !unmounted){
                setPositions(res.data.polyline);
            }
        })();
        return () => {
            unmounted = true
        }
    }, [props.route]);

    useEffect(() => {
        setPolyline(positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng]))
        return () => {};
    }, [positions]);

    //Todo: コンポーネントにして、別ファイルに移動
    const Markers: JSX.Element[] = positions.map((pos: LatLng, idx: number): JSX.Element => {
        async function onClickMarker(pos: number){
            const res = await patchDelete(props.route, pos);
            if(res){
                setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
            }
        }

        return (
            <Marker
                position={[pos.lat, pos.lng]}
                key={nanoid()}
                eventHandlers={{click: ()=>{
                    onClickMarker(idx)}
                }} //todo: ここの関数を一つにまとめたい
            >
            </Marker>
        )
    })

    //Todo: 別ファイルに移動する
    const Polylines: FunctionComponent<PolylineProps> = (props: PolylineProps) => {
        if(props.polyline.length){
            let polylines: JSX.Element[] = new Array(props.polyline.length - 1);
            for(let idx = 0; idx < props.polyline.length - 1; idx++){
                polylines[idx] = (
                    //Todo: 線の太さを上げて、線をクリックしやすくする
                    <Polyline
                        pathOptions={limeOptions} 
                        positions={[polyline[idx], polyline[idx + 1]]}
                        key={nanoid()}
                        eventHandlers={{click: 
                            async (event: L.LeafletMouseEvent)=>{
                                L.DomEvent.stopPropagation(event) //clickLayerに対してクリックイベントを送らない
                                const res = await patchAdd(event.latlng.lat, event.latlng.lng, idx + 1, props.route)
                                if(res){
                                    props.setPositions(res.data.points.map((position) => new LatLng(position.latitude, position.longitude)));
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

    async function onClickClearHandler(): Promise<void>{
        const res = await patchClear(props.route);
        if(res){
            setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
        }
    }

    async function onClickUndoHandler(): Promise<void>{
        const res = await patchUndo(props.route);
        if(res){
            setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
        }
    }

    async function onClickRedoHandler(): Promise<void>{
        const res = await patchRedo(props.route);
        if(res){
            setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
        }
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