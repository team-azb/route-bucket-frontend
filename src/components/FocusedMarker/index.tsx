import { useRef } from "react";
import { FocusedMarkerIcon } from "./focusedMarkerIcon";
import { Marker } from "react-leaflet";
import L, { Marker as MarkerType } from "leaflet";
import { Route, FocusedMarkerInfo } from "../../types";
import { patchAdd } from "../../api/routes";

type FocusedMarkerProps = {
  zoomSize: number;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  FocusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

export default function FocusedMarker(props: FocusedMarkerProps) {
  const markerRef = useRef<MarkerType>(null);
  async function onClickMarker(latlng: L.LatLng, idx: number) {
    const res = await patchAdd(props.route.id, idx, {
      coord: {
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
    });
    if (res) {
      props.setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  }

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && props.FocusedMarkerInfo.idx !== null) {
      const res = await patchAdd(
        props.route.id,
        props.FocusedMarkerInfo.idx + 1,
        {
          coord: {
            latitude: newPoint.lat,
            longitude: newPoint.lng,
          },
        }
      );
      if (res) {
        props.setRoute((prevState) => {
          return { ...prevState, ...res.data };
        });
      }
    }
  }

  return (
    <>
      {props.FocusedMarkerInfo.shouldDisplayed && (
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
