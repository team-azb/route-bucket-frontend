import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { nanoid } from 'nanoid';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng } from 'leaflet';

const limeOptions = { color: 'lime' }

function ClickLayer({positions, setPositions}: any){
  const map = useMapEvent('click', (e: any)=>{
    setPositions([...positions, e.latlng]);
  })
  
  return null;
}

function App() {
  const [positions, setPositions] = useState([]);

  const polyline: any = positions.map((pos: LatLng) => [pos.lat, pos.lng])

  const Markers: any = positions.map((pos: LatLng) => {
    return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
  })

  function onClickHandler(){
    setPositions([]);
  }

  return (
    <>
      <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickLayer positions={positions} setPositions={setPositions}/>
        {Markers}
        {polyline === [] ? null : <Polyline pathOptions={limeOptions} positions={polyline} />}
      </MapContainer>
      <button onClick={onClickHandler}>リセット</button>
    </>
  );
}

export default App;
