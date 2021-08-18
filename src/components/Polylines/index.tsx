import { Polyline, useMapEvent } from "react-leaflet";
import { PathOptions } from "leaflet";
import { nanoid } from "nanoid";
import { Route, FocusedMarkerInfo, Segment } from "../../types";

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

/**
 * map内でポリーラインのJSX Elementを生成するための関数
 * @param segment ポリーラインで表示する区間のsegment
 * @param idx 区間の順番
 * @param props PolylineProps
 * @returns ポリーラインのJSX Element
 */
function polylineGenerator(
  segment: Segment,
  idx: number,
  props: PolylineProps
) {
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
}

export default function Polylines(props: PolylineProps) {
  useMapEvent("zoomend", (event) => {
    props.setZoomSize(event.target._zoom);
  });

  let polylines = props.route.segments.map((segment, idx) => {
    return polylineGenerator(segment, idx, props);
  });

  return <>{polylines}</>;
}
