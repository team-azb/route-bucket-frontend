import { Polyline, useMapEvent } from "react-leaflet";
import { PathOptions } from "leaflet";
import { nanoid } from "nanoid";
import { Route, FocusedMarkerInfo } from "../../types";

const pathOptions: PathOptions = {
  color: "#0000cd",
  weight: 5,
};

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setZoomSize: React.Dispatch<React.SetStateAction<number>>;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
};

export default function Polylines(props: PolylineProps) {
  useMapEvent("zoomend", (event) => {
    props.setZoomSize(event.target._zoom);
  });

  let polylines: JSX.Element[] = props.route.segments.map((segment, idx) => {
    return (
      <Polyline
        pathOptions={pathOptions}
        positions={segment["points"].map((point) => [
          point.latitude,
          point.longitude,
        ])}
        key={nanoid()}
        eventHandlers={{
          mouseover: (event) => {
            props.setFocusedMarkerInfo((prevState) => {
              return {
                ...prevState,
                idx: idx,
                position: event.latlng,
                shouldDisplayed: true,
              };
            });
          },
        }}
      />
    );
  });
  return <>{polylines}</>;
}
