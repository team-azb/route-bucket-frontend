import { useState, useEffect, FunctionComponent } from 'react';
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import { getRoute, patchAdd, patchDelete, patchUndo, patchRedo, patchClear } from '../api/routes'
import { Position } from '../types'
import 'leaflet/dist/leaflet.css';

const limeOptions: {color: string} = { color: 'lime' }

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
    waypoints: Position[],
    route: string,
    setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>,
    setLinestring: React.Dispatch<React.SetStateAction<Position[]>>
}

//Polylineコンポーネントのpropsの型
type PolylineProps = {
    polyline: LatLngExpression[],
    route: string,
    setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>,
    setLinestring: React.Dispatch<React.SetStateAction<Position[]>>
}

//URLのパラメータのinerface
interface RouteEditorParams{
    routeId: string
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

function RouteEditor(): JSX.Element{
    const [waypoints, setWaypoints] = useState<Position[]>([]);
    const [linestring, setLinestring] = useState<Position[]>([]);
    const [routeName, setRouteName] = useState<string>('');
    const polyline = waypoints.map((pos: Position): LatLngExpression => [pos.latitude, pos.longitude])
    const { routeId } = useParams<RouteEditorParams>()

    //Mapのルート変更時にルートを取得してwaypointsを変更する
    useEffect(() => {       
        let unmounted = false;
        (async () => {
            const res = await getRoute(routeId)           
            if(res && !unmounted){
                if (res.data.waypoints) {setWaypoints(res.data.waypoints)};
                if (res.data.linestring) {setLinestring(res.data.linestring)};
                setRouteName(res.data.name)
            }
        })();
        return () => {
            unmounted = true
        }
    }, [routeId]);

    const Markers: JSX.Element[] = waypoints.map((pos: Position, idx: number): JSX.Element => {
        async function onClickMarker(pos: number){
            const res = await patchDelete(routeId, pos);
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
                                    props.setLinestring(res.data.linestring);
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
        const res = await patchClear(routeId);
        if(res){
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    async function onClickUndoHandler(): Promise<void>{
        const res = await patchUndo(routeId);
        if(res){
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    async function onClickRedoHandler(): Promise<void>{
        const res = await patchRedo(routeId);
        if(res){
            setWaypoints(res.data.waypoints);
            setLinestring(res.data.linestring);
        }
    }

    return(
        <>
        <p>ルートid: {routeId}</p>
        <p>ルート名: {routeName}</p>
        <MapContainer style={{height: '600px'}} center={[35.68139740310467, 139.7671569841016]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Markers}
            <Polylines 
                polyline={polyline} 
                route={routeId} 
                setWaypoints={setWaypoints}
                setLinestring={setLinestring}
            />
            <Polyline positions={linestring.map(pos => [pos.latitude, pos.longitude])}/>
        <ClickLayer 
            route={routeId}
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