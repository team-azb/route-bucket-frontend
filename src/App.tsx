import { useState, useEffect } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { nanoid } from 'nanoid';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from 'react-leaflet';
import { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';

const limeOptions: {color: string} = { color: 'lime' }

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

function App(): JSX.Element{
  const [positions, setPositions] = useState<LatLng[]>([]);
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    setPolyline(positions.map((pos: LatLng): LatLngExpression => [pos.lat, pos.lng]))
  }, [positions]);

  const Markers: JSX.Element[] = positions.map((pos: LatLng): JSX.Element => {
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
