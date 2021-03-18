import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';

const polyline: any = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
]
const limeOptions = { color: 'lime' }

function LocationMarker(){
  const [position, setPosition]: any = useState(null);
  const map = useMapEvents({
    click(){
      map.locate() //ユーザーの現在地点を取得してlocationfoundイベントを発火させる
    },
    locationfound(e: any) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

function App() {
  return (
    <MapContainer style={{height: '600px'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <LocationMarker />
      <Polyline pathOptions={limeOptions} positions={polyline} />
    </MapContainer>
  );
}

export default App;
