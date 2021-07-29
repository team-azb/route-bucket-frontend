import { useRef } from "react";
import { ManipulatingMarkerIcon } from "./manipulatingMarkerIcon";
import { Marker } from "react-leaflet";
import L, { Marker as MarkerType } from "leaflet";
import { Route, ManipulatingMarkerInfo } from "../../types";
import { patchAdd } from "../../api/routes";

type ManipulatingMarkerProps = {
  zoomSize: number;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  manipulatingMarkerInfo: ManipulatingMarkerInfo;
  setManipulatingMarkerInfo: React.Dispatch<
    React.SetStateAction<ManipulatingMarkerInfo>
  >;
};

export default function ManipulatingMarker(props: ManipulatingMarkerProps) {
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
    if (newPoint && props.manipulatingMarkerInfo.idx !== null) {
      const res = await patchAdd(
        props.route.id,
        props.manipulatingMarkerInfo.idx + 1,
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
      {props.manipulatingMarkerInfo.position && (
        <Marker
          icon={ManipulatingMarkerIcon(props.zoomSize)}
          ref={markerRef}
          draggable={true}
          position={props.manipulatingMarkerInfo.position}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              props.manipulatingMarkerInfo.idx &&
                onClickMarker(
                  event.latlng,
                  props.manipulatingMarkerInfo.idx + 1
                );
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
