import { Polyline } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { nanoid } from "nanoid";
import { patchAdd } from "../../api/routes";
import { Position } from "../../types";

const limeOptions: { color: string } = { color: "lime" };

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  polyline: LatLngExpression[];
  route: string;
  setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>;
  setLinestring: React.Dispatch<React.SetStateAction<Position[]>>;
};

export default function Polylines(props: PolylineProps) {
  if (props.polyline.length) {
    let polylines: JSX.Element[] = new Array(props.polyline.length - 1);
    for (let idx = 0; idx < props.polyline.length - 1; idx++) {
      polylines[idx] = (
        //Todo: 線の太さを上げて、線をクリックしやすくする
        <Polyline
          pathOptions={limeOptions}
          positions={[props.polyline[idx], props.polyline[idx + 1]]}
          key={nanoid()}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              const res = await patchAdd(props.route, idx + 1, {
                coord: {
                  latitude: event.latlng.lat,
                  longitude: event.latlng.lng,
                },
              });
              if (res) {
                props.setWaypoints(res.data.waypoints);
                props.setLinestring(res.data.linestring);
              }
            },
          }}
        />
      );
    }
    return <>{polylines}</>;
  } else {
    return null;
  }
}
