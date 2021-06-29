import { useState, useEffect, FunctionComponent } from 'react';
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, useMapEvent } from 'react-leaflet';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { getRoute, patchAdd, patchUndo, patchRedo, patchClear } from '../../api/routes'
import { Position } from '../../types'
import { Markers } from '../../components/Markers'
import { Polylines } from '../../components/Polylines'
import 'leaflet/dist/leaflet.css';

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
    waypoints: Position[],
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

const RouteEditor: FunctionComponent = () => {
    const [waypoints, setWaypoints] = useState<Position[]>([]);
    const [linestring, setLinestring] = useState<Position[]>([]);
    const [routeName, setRouteName] = useState<string>('');
    const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(false);
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
                setChangeCenterFlag(true)
            }
        })();
        return () => {
            unmounted = true
        }
    }, [routeId]);

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
        <Link to='/'>ルート一覧へ</Link>
        <hr/>
        <p>ルートid: {routeId}</p>
        <p>ルート名: {routeName}</p>
        <MapContainer style={{height: '600px'}} center={[35.68139740310467, 139.7671569841016]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers
                waypoints={waypoints}
                route={routeId}
                changeCenterFlag={changeCenterFlag}
                setChangeCenterFlag={setChangeCenterFlag}
                setWaypoints={setWaypoints}
                setLinestring={setLinestring}
            />
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

export default RouteEditor