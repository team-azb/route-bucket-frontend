import { useRef } from "react";
import { FocusedMarkerIcon } from "./focusedMarkerIcon";
import { Marker } from "react-leaflet";
import L, { Marker as MarkerType } from "leaflet";
import { Route, FocusedMarkerInfo, DrawingMode } from "../../../types";
import {
  routeAsyncAction,
  routeReducerAction,
} from "../../../reducers/routeReducer";
import { useAuthenticationInfoContext } from "../../../contexts/AuthenticationProvider";

type FocusedMarkerProps = {
  zoomSize: number;
  route: Route;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawingMode: DrawingMode;
};

export default function FocusedMarker(props: FocusedMarkerProps) {
  const { getIdToken } = useAuthenticationInfoContext();
  const markerRef = useRef<MarkerType>(null);
  async function clickMarkerHandler(latlng: L.LatLng, idx: number) {
    const token = await getIdToken();
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "INSERT",
      targetIdx: idx,
      coord: {
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
      mode: props.drawingMode,
      token: token,
    });
  }

  async function dragMarkerHandler() {
    const token = await getIdToken();
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && props.focusedMarkerInfo.idx !== null) {
      props.setIsLoading(true);
      props.dispatchRoute({
        type: "INSERT",
        targetIdx: props.focusedMarkerInfo.idx + 1,
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
        mode: props.drawingMode,
        token: token,
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
                clickMarkerHandler(
                  event.latlng,
                  props.focusedMarkerInfo.idx + 1
                );
            },
            dragend: () => {
              dragMarkerHandler();
            },
          }}
        />
      )}
    </>
  );
}
