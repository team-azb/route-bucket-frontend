import { useState, useRef } from "react";
import { Polyline, Marker, useMapEvent } from "react-leaflet";
import { Marker as MarkerType, PathOptions } from "leaflet";
import L from "leaflet";
import { nanoid } from "nanoid";
import { patchAdd } from "../../api/routes";
import { Route } from "../../types";
import { TempMarkerIcon } from "./tempMarkerIcon";

const pathOptions: PathOptions = {
  color: "#0000cd",
  weight: 5,
};

//Polylineコンポーネントのpropsの型
type PolylineProps = {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
};

type TempMarkerInfo = {
  position: L.LatLng | null;
  index: number | null;
};

export default function Polylines(props: PolylineProps) {
  const markerRef = useRef<MarkerType>(null);
  const [tempMarkerInfo, setTempMarkerInfo] = useState<TempMarkerInfo>({
    position: null,
    index: null,
  });
  const [zoomSize, setZoomSize] = useState<number>(13);

  useMapEvent("zoomend", (event) => {
    setZoomSize(event.target._zoom);
  });

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && tempMarkerInfo.index !== null) {
      const res = await patchAdd(props.route.id, tempMarkerInfo.index + 1, {
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
      });
      if (res) {
        props.setRoute({ ...props.route, ...res.data });
        setTempMarkerInfo({ index: null, position: null });
      }
    }
  }

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
            setTempMarkerInfo({
              ...tempMarkerInfo,
              index: idx,
              position: event.latlng,
            });
          },
        }}
      />
    );
  }
  return (
    <>
      {polylines}
      {tempMarkerInfo.position && (
        <Marker
          icon={TempMarkerIcon(zoomSize)}
          ref={markerRef}
          draggable={true}
          position={tempMarkerInfo.position}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              tempMarkerInfo.index &&
                onClickMarker(event.latlng, tempMarkerInfo.index + 1);
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
