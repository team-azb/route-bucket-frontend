import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { nanoid } from 'nanoid';
import 'leaflet/dist/leaflet.css';

const limeOptions: {color: string} = { color: 'lime' }

//Todo: interface使うようにする
type ClickLayerProps = {
    positions: LatLng[],
    setPositions: React.Dispatch<React.SetStateAction<LatLng[]>>
}
  
function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', (e: LeafletMouseEvent)=>{
        props.setPositions([...props.positions, e.latlng]);
    })
    return null;
}

function Map(){
    const [positions, setPositions] = useState<LatLng[]>([]);

    const Markers: JSX.Element[] = positions.map((pos: LatLng): JSX.Element => {
        return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
    })

    const polyline: LatLngExpression[] = positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng])

    function onClickHandler(): void{
        setPositions([]);
    }
    return(
        <>
        <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            {Markers}
            <Polyline pathOptions={limeOptions} positions={polyline}/>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        <ClickLayer positions={positions} setPositions={setPositions}/>
        </MapContainer>
        <button onClick={onClickHandler}>リセット</button>
        </>
    )
}

export default Map;