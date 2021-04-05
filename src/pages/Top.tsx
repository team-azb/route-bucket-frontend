import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import Map from '../components/Map';

function Top(): JSX.Element{
  const [positions, setPositions] = useState<LatLng[]>([]);

  function onClickHandler(): void{
    setPositions([]);
  }

  return (
    <>
      <Map positions={positions} setPositions={setPositions}/>
      <button onClick={onClickHandler}>リセット</button>
    </>
  );
}

export default Top;
