import { Polyline } from "react-leaflet";
import L from "leaflet";
import { nanoid } from "nanoid";
import { patchAdd } from "../../api/routes";
import { Position, Segment } from "../../types";

const limeOptions: { color: string } = { color: "lime" };

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  segments: Segment[];
  route: string;
  setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>;
  setSegments: React.Dispatch<React.SetStateAction<Segment[]>>;
};

export default function Polylines(props: PolylineProps) {
  if (props.segments.length) {
    let polylines: JSX.Element[] = new Array(props.segments.length);
    for (let idx = 0; idx < props.segments.length; idx++) {
      polylines[idx] = (
        //Todo: 線の太さを上げて、線をクリックしやすくする
        <Polyline
          pathOptions={limeOptions}
          positions={props.segments[idx]["points"].map((point) => [
            point.latitude,
            point.longitude,
          ])}
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
                props.setSegments(res.data.segments);
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
