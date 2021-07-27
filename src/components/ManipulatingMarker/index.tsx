import { useRef } from "react";
import { TempMarkerIcon } from "./tempMarkerIcon";
import { Marker } from "react-leaflet";
import L, { Marker as MarkerType } from "leaflet";
import { Route, TempMarkerInfo } from "../../types";
import { patchAdd } from "../../api/routes";

type ManipulatingMarkerProps = {
  zoomSize: number;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  tempMarkerInfo: TempMarkerInfo;
  setTempMarkerInfo: React.Dispatch<React.SetStateAction<TempMarkerInfo>>;
};

export default function ManipulatingMarker(props: ManipulatingMarkerProps) {
  const markerRef = useRef<MarkerType>(null);
  async function onClickMarker(latlng: L.LatLng, index: number) {
    const res = await patchAdd(props.route.id, index, {
      coord: {
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
    });
    if (res) {
      props.setRoute({ ...props.route, ...res.data });
    }
  }

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && props.tempMarkerInfo.index !== null) {
      const res = await patchAdd(
        props.route.id,
        props.tempMarkerInfo.index + 1,
        {
          coord: {
            latitude: newPoint.lat,
            longitude: newPoint.lng,
          },
        }
      );
      if (res) {
        props.setRoute({ ...props.route, ...res.data });
        props.setTempMarkerInfo({ index: null, position: null });
      }
    }
  }

  return (
    <>
      {props.tempMarkerInfo.position && (
        <Marker
          icon={TempMarkerIcon(props.zoomSize)}
          ref={markerRef}
          draggable={true}
          position={props.tempMarkerInfo.position}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              props.tempMarkerInfo.index &&
                onClickMarker(event.latlng, props.tempMarkerInfo.index + 1);
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
