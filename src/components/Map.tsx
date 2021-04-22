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
  
function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', (e: LeafletMouseEvent)=>{
        async function patchAdd(){
            const payload = {
                coord:{
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }
            }
            const res = await axios.patch('/routes/'+props.route+'/add/'+props.positions.length, payload);
            // console.log(res);
            props.setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
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
            // console.log(res.data.polyline);
            setPositions(res.data.polyline);
        }
        try {
            getRoute();
        } catch (error) {
            console.error(error);
        }
        return () => {
            // cleanup
        };
    }, [props.route]);

    const Markers: JSX.Element[] = positions.map((pos: LatLng): JSX.Element => {
        return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
    })

    const polyline: LatLngExpression[] = positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng])

    function onClickHandler(): void{
        setPositions([]);
    }

    function onClickUndoHandler(): void{
        async function patchUndo(){
            const res = await axios.patch('/routes/'+props.route+'/undo/');
            setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
        }
        patchUndo();
    }

    function onClickRedoHandler(): void{
        async function pathRedo(){
            const res = await axios.patch('/routes/'+props.route+'/redo/');
            setPositions(res.data.points.map((position: any) => new LatLng(position.latitude, position.longitude)));
        }
        pathRedo();
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
        <button onClick={onClickUndoHandler}>undo</button>
        <button onClick={onClickRedoHandler}>redo</button>
        <button onClick={onClickHandler}>clear</button>
        </>
    )
}

export default Map;