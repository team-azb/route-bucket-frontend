import { Polyline } from "react-leaflet";
import L from "leaflet";
import { nanoid } from "nanoid";
import { patchAdd } from "../../api/routes";
import { Route } from "../../types";

const blueOptions: { color: string } = { color: "#0000cd" };

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
};

export default function Polylines(props: PolylineProps) {
  let polylines: JSX.Element[] = new Array(props.route.segments.length);
  for (let idx = 0; idx < props.route.segments.length; idx++) {
    polylines[idx] = (
      //Todo: 線の太さを上げて、線をクリックしやすくする
      <Polyline
        pathOptions={blueOptions}
        positions={props.route.segments[idx]["points"].map((point) => [
          point.latitude,
          point.longitude,
        ])}
        key={nanoid()}
        eventHandlers={{
          click: async (event: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
            const res = await patchAdd(props.route.id, idx + 1, {
              coord: {
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
              },
            });
            if (res) {
              props.setRoute({ ...props.route, ...res.data });
            }
          },
        }}
      />
    );
  }
  return <>{polylines}</>;
}
