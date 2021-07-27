import { Polyline, useMapEvent } from "react-leaflet";
import { PathOptions } from "leaflet";
import { nanoid } from "nanoid";
import { Route, TempMarkerInfo } from "../../types";

const pathOptions: PathOptions = {
  color: "#0000cd",
  weight: 5,
};

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  tempMarkerInfo: TempMarkerInfo;
  setTempMarkerInfo: React.Dispatch<React.SetStateAction<TempMarkerInfo>>;
  setZoomSize: React.Dispatch<React.SetStateAction<number>>;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
};

export default function Polylines(props: PolylineProps) {
  useMapEvent("zoomend", (event) => {
    props.setZoomSize(event.target._zoom);
  });

  let polylines: JSX.Element[] = new Array(props.route.segments.length);
  for (let idx = 0; idx < props.route.segments.length; idx++) {
    polylines[idx] = (
      //Todo: 線の太さを上げて、線をクリックしやすくする
      <Polyline
        pathOptions={pathOptions}
        positions={props.route.segments[idx]["points"].map((point) => [
          point.latitude,
          point.longitude,
        ])}
        key={nanoid()}
        eventHandlers={{
          mouseover: (event) => {
            props.setTempMarkerInfo({
              ...props.tempMarkerInfo,
              index: idx,
              position: event.latlng,
            });
          },
        }}
      />
    );
  }
  return <>{polylines}</>;
}
