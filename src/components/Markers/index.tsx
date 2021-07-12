import { useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import { patchDelete, patchMove } from "../../api/routes";
import { Position, Segment } from "../../types";

type MakersProps = {
  waypoints: Position[];
  route: string;
  changeCenterFlag: boolean;
  setChangeCenterFlag: React.Dispatch<React.SetStateAction<boolean>>;
  setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>;
  setSegments: React.Dispatch<React.SetStateAction<Segment[]>>;
  setElevationGain: React.Dispatch<React.SetStateAction<number>>;
}

export default function Markers(props: MakersProps) {
  const map = useMap();
  const markerRefs = useRef<Array<RefObject<MarkerType>>>(
    Array(props.waypoints.length)
  );
  useEffect(() => {
    if (props.changeCenterFlag) {
      if (props.waypoints.length) {
        map.setView([
          props.waypoints[0].latitude,
          props.waypoints[0].longitude,
        ]);
      }
      props.setChangeCenterFlag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeCenterFlag]);
  const markers = props.waypoints.map(
    (pos: Position, idx: number): JSX.Element => {
      markerRefs.current[idx] = createRef<MarkerType>();
      async function onClickMarker(idx: number) {
        const res = await patchDelete(props.route, idx);
        if (res) {
          props.setWaypoints(res.data.waypoints);
          props.setSegments(res.data.segments);
          props.setElevationGain(res.data.elevation_gain);
        }
      }

      async function onDragMarker(idx: number) {
        const newPoint = markerRefs.current[idx].current?.getLatLng();
        if (newPoint) {
          const res = await patchMove(props.route, idx, {
            coord: {
              latitude: newPoint.lat,
              longitude: newPoint.lng,
            },
          });
          if (res) {
            props.setWaypoints(res.data.waypoints);
            props.setSegments(res.data.segments);
            props.setElevationGain(res.data.elevation_gain);
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
