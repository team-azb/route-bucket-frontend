import { useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import { patchDelete, patchMove } from "../../api/routes";
import { Position, Route, FocusedMarkerInfo } from "../../types";
import { MarkerIcon, GoalMarkerIcon, StartMarkerIcon } from "./markerIcon";

type MakersProps = {
  changeCenterFlag: boolean;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setChangeCenterFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * マーカーで利用する適切なiconを返す関数
 * @param idx マーカーのindex
 * @param firstIdx スタートのマーカーのindex
 * @param lastIdx ゴールのマーカーのindex
 * @returns マーカーで利用するicon
 */
function determineMarkerIcon(idx: number, firstIdx: number, lastIdx: number) {
  switch (idx) {
    case firstIdx:
      return StartMarkerIcon;
    case lastIdx:
      return GoalMarkerIcon;
    default:
      return MarkerIcon;
  }
}

export default function Markers(props: MakersProps) {
  const map = useMap();
  const markerRefs = useRef<Array<RefObject<MarkerType>>>(
    Array(props.route.waypoints.length)
  );
  useEffect(() => {
    if (props.changeCenterFlag) {
      if (props.route.waypoints.length) {
        map.setView([
          props.route.waypoints[0].latitude,
          props.route.waypoints[0].longitude,
        ]);
      }
      props.setChangeCenterFlag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeCenterFlag]);
  const markers = props.route.waypoints.map(
    (pos: Position, idx: number): JSX.Element => {
      const markerIcon = determineMarkerIcon(
        idx,
        0,
        props.route.waypoints.length - 1
      );
      markerRefs.current[idx] = createRef<MarkerType>();
      async function onClickMarker(idx: number) {
        const res = await patchDelete(props.route.id, idx);
        if (res) {
          props.setRoute((prevState) => {
            return { ...prevState, ...res.data };
          });
        }
      }

      async function onDragMarker(idx: number) {
        const newPoint = markerRefs.current[idx].current?.getLatLng();
        if (newPoint) {
          const res = await patchMove(props.route.id, idx, {
            coord: {
              latitude: newPoint.lat,
              longitude: newPoint.lng,
            },
          });
          if (res) {
            props.setRoute((prevState) => {
              return { ...prevState, ...res.data };
            });
          }
        }
      }

      return (
        <Marker
          icon={markerIcon}
          zIndexOffset={
            idx === 0 ? props.route.waypoints.length * 100 : idx * 100
          }
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
