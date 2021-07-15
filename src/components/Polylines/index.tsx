import { useState, useRef } from "react";
import { Polyline, Marker } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import L from "leaflet";
import { nanoid } from "nanoid";
import { patchAdd, patchMove } from "../../api/routes";
import { Route } from "../../types";

const blueOptions: { color: string } = { color: "#0000cd" };

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

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && tempMarkerInfo.index) {
      const res = await patchMove(props.route.id, tempMarkerInfo.index, {
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

  if (props.route.segments.length) {
    let polylines: JSX.Element[] = new Array(props.route.segments.length);
    for (let idx = 0; idx < props.route.segments.length; idx++) {
      polylines[idx] = (
        //Todo: 線の太さを上げて、線をクリックしやすくする
        <Polyline
          pathOptions={blueOptions}
          positions={props.route.segments[idx]["points"].map((point) => [
            point.latitude,
            point.longitude,
          ])}
          key={nanoid()}
          eventHandlers={{
            click: async (event: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
              const res = await patchAdd(props.route.id, idx + 1, {
                coord: {
                  latitude: event.latlng.lat,
                  longitude: event.latlng.lng,
                },
              });
              if (res) {
                props.setRoute({ ...props.route, ...res.data });
              }
            },
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
            ref={markerRef}
            draggable={true}
            position={tempMarkerInfo.position}
            eventHandlers={{
              dragend: () => {
                onDragMarker();
              },
            }}
          />
        )}
      </>
    );
  } else {
    return null;
  }
}
