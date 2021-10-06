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
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
      setIsLoading: props.setIsLoading,
    });
  }

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && props.focusedMarkerInfo.idx !== null) {
      props.dispatchRoute({
        type: "INSERT",
        targetIdx: props.focusedMarkerInfo.idx + 1,
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
        setIsLoading: props.setIsLoading,
      });
    }
  }

  return (
    <>
      {props.focusedMarkerInfo.isDisplayed && (
        <Marker
          icon={FocusedMarkerIcon(props.zoomSize)}
          ref={markerRef}
          draggable={true}
          position={props.focusedMarkerInfo.position}
          eventHandlers={{
            click: async (event) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              props.focusedMarkerInfo.idx &&
                onClickMarker(event.latlng, props.focusedMarkerInfo.idx + 1);
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
