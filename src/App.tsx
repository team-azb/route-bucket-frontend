import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { nanoid } from 'nanoid';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng } from 'leaflet';

const polyline: any = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
]
const limeOptions = { color: 'lime' }

function MarkerComponent(){
  const [positions, setPositions]: any = useState([]);

  const map = useMapEvent('click', (e: any)=>{
    setPositions([...positions, e.latlng]);
  })

  const Markers = positions.map((pos: LatLng) => {
    return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
  })
  
  return (
    <>
    {Markers}
    </>
  );
}

function App() {
  return (
    <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerComponent/>
      {/* <Polyline pathOptions={limeOptions} positions={polyline} /> */}
    </MapContainer>
  );
}

export default App;
