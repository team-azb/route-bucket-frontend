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

//Todo: interface使うようにする
type MapProps = {
    positions: LatLng[],
    setPositions: React.Dispatch<React.SetStateAction<LatLng[]>>
}
  
function ClickLayer(props: ClickLayerProps): null{
    useMapEvent('click', (e: LeafletMouseEvent)=>{
        props.setPositions([...props.positions, e.latlng]);
    })
    return null;
}

function Map(props: MapProps){
    const Markers: JSX.Element[] = props.positions.map((pos: LatLng): JSX.Element => {
        return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
    })
    const polyline: LatLngExpression[] = props.positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng])
    return(
        <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            {Markers}
            <Polyline pathOptions={limeOptions} positions={polyline}/>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        <ClickLayer positions={props.positions} setPositions={props.setPositions}/>
        </MapContainer>
    )
}

export default Map;