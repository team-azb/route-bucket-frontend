import { useRef } from "react";
import { FocusedMarkerIcon } from "./focusedMarkerIcon";
import { Marker } from "react-leaflet";
import L, { Marker as MarkerType } from "leaflet";
import { Route, FocusedMarkerInfo } from "../../types";
import {
  routeAsyncAction,
  routeReducerAction,
} from "../../reducers/routeReducer";

type FocusedMarkerProps = {
  zoomSize: number;
  route: Route;
  FocusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
};

export default function FocusedMarker(props: FocusedMarkerProps) {
  const markerRef = useRef<MarkerType>(null);
  function onClickMarker(latlng: L.LatLng, idx: number) {
    props.dispatchRoute({
      type: "INSERT",
      targetIdx: idx,
      coord: {
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
    });
  }

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && props.FocusedMarkerInfo.idx !== null) {
      props.dispatchRoute({
        type: "INSERT",
        targetIdx: props.FocusedMarkerInfo.idx + 1,
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
      });
    }
  }

  return (
    <>
      {props.FocusedMarkerInfo.isDisplayed && (
        <Marker
          icon={FocusedMarkerIcon(props.zoomSize)}
          ref={markerRef}
          draggable={true}
          position={props.FocusedMarkerInfo.position}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              props.FocusedMarkerInfo.idx &&
                onClickMarker(event.latlng, props.FocusedMarkerInfo.idx + 1);
            },
            dragend: () => {
              onDragMarker();
            },
          }}
        />
      )}
    </>
  );
}
