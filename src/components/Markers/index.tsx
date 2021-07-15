import { useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import { patchDelete, patchMove } from "../../api/routes";
import { Position, Route } from "../../types";

type MakersProps = {
  changeCenterFlag: boolean;
  routeInfo: Route;
  setRouteInfo: React.Dispatch<React.SetStateAction<Route>>;
  setChangeCenterFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Markers(props: MakersProps) {
  const map = useMap();
  const markerRefs = useRef<Array<RefObject<MarkerType>>>(
    Array(props.routeInfo.waypoints.length)
  );
  useEffect(() => {
    if (props.changeCenterFlag) {
      if (props.routeInfo.waypoints.length) {
        map.setView([
          props.routeInfo.waypoints[0].latitude,
          props.routeInfo.waypoints[0].longitude,
        ]);
      }
      props.setChangeCenterFlag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeCenterFlag]);
  const markers = props.routeInfo.waypoints.map(
    (pos: Position, idx: number): JSX.Element => {
      markerRefs.current[idx] = createRef<MarkerType>();
      async function onClickMarker(idx: number) {
        const res = await patchDelete(props.routeInfo.id, idx);
        if (res) {
          props.setRouteInfo({ ...props.routeInfo, ...res.data });
        }
      }

      async function onDragMarker(idx: number) {
        const newPoint = markerRefs.current[idx].current?.getLatLng();
        if (newPoint) {
          const res = await patchMove(props.routeInfo.id, idx, {
            coord: {
              latitude: newPoint.lat,
              longitude: newPoint.lng,
            },
          });
          if (res) {
            props.setRouteInfo({ ...props.routeInfo, ...res.data });
          }
        }
      }

      return (
        <Marker
          ref={markerRefs.current[idx]}
          draggable={true}
          position={[pos.latitude, pos.longitude]}
          key={nanoid()}
          eventHandlers={{
            click: () => {
              onClickMarker(idx);
            },
            dragend: () => {
              onDragMarker(idx);
            },
          }} //todo: ここの関数を一つにまとめたい
        ></Marker>
      );
    }
  );
  return <>{markers}</>;
}
