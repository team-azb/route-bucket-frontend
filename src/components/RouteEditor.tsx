import { useState, useEffect, FunctionComponent } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import { getRoute, patchAdd, patchDelete, patchUndo, patchRedo, patchClear } from '../api/route'
import 'leaflet/dist/leaflet.css';
import { Postion } from '../types/Position'

const limeOptions: {color: string} = { color: 'lime' }

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
    waypoints: Postion[],
    route: string,
    setWaypoints: React.Dispatch<React.SetStateAction<Postion[]>>,
    setLinestring: React.Dispatch<React.SetStateAction<Postion[]>>
}

//Polylineコンポーネントのpropsの型
type PolylineProps = {
    polyline: LatLngExpression[],
    route: string,
    setWaypoints: React.Dispatch<React.SetStateAction<Postion[]>>
}

function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', async (e: LeafletMouseEvent)=>{
        const res = await patchAdd(e.latlng.lat, e.latlng.lng, props.waypoints.length, props.route);
        if(res){
            props.setWaypoints(res.data.waypoints);
            props.setLinestring(res.data.linestring);
        }
    })
    return null;
}

function RouteEditor(props: any): JSX.Element{
    const [waypoints, setWaypoints] = useState<Postion[]>([]);
    const [linestring, setLinestring] = useState<Postion[]>([]);
    const polyline = waypoints.map((pos: Postion): LatLngExpression => [pos.latitude, pos.longitude])

    //Mapのルート変更時にルートを取得してwaypointsを変更する
    useEffect(() => {       
        let unmounted = false;
        (async () => {
            const res = await getRoute(props.route)
            if(res && !unmounted){
                setWaypoints(res.data.waypoints);
                setLinestring(res.data.linestring);
            }
        })();
        return () => {
            unmounted = true
        }
    }, [props.route]);

    const Markers: JSX.Element[] = waypoints.map((pos: Postion, idx: number): JSX.Element => {
        async function onClickMarker(pos: number){
            const res = await patchDelete(props.route, pos);
            if(res){
                setWaypoints(res.data.waypoints);
                setLinestring(res.data.linestring);
            }
        }

        return (
            <Marker
                position={[pos.latitude, pos.longitude]}
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
                                    props.setWaypoints(res.data.waypoints);
                                    setLinestring(res.data.linestring);
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
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    async function onClickUndoHandler(): Promise<void>{
        const res = await patchUndo(props.route);
        if(res){
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    async function onClickRedoHandler(): Promise<void>{
        const res = await patchRedo(props.route);
        if(res){
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    return(
        <>
        <p>現在のルート: {props.route}</p>
        <MapContainer style={{height: '600px'}} center={[35.68139740310467, 139.7671569841016]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Markers}
            <Polylines polyline={polyline} route={props.route} setWaypoints={setWaypoints}/>
            <Polyline positions={linestring.map(pos => [pos.latitude, pos.longitude])}/>
        <ClickLayer 
            route={props.route}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            setLinestring={setLinestring}
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