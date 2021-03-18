import { useState } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { nanoid } from 'nanoid';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';

const limeOptions = { color: 'lime' }

type ClickLayerProps = {
  positions: LatLng[],
  setPositions: React.Dispatch<React.SetStateAction<LatLng[]>>
}

function ClickLayer(props: ClickLayerProps){
  useMapEvent('click', (e: LeafletMouseEvent)=>{
    props.setPositions([...props.positions, e.latlng]);
  })
  
  return null;
}

function App() {
  const [positions, setPositions] = useState< LatLng[]>([]);

  const polyline: LatLngExpression[] = positions.map((pos: LatLng) => [pos.lat, pos.lng])

  const Markers: any = positions.map((pos: LatLng) => {
    return <Marker position={[pos.lat, pos.lng]} key={nanoid()}/>
  })

  function onClickHandler(): void{
    setPositions([]);
  }

  return (
    <>
      <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
      {Markers}
        {polyline === [] ? null : <Polyline pathOptions={limeOptions} positions={polyline} />}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickLayer positions={positions} setPositions={setPositions}/>
      </MapContainer>
      <button onClick={onClickHandler}>リセット</button>
    </>
  );
}

export default App;
