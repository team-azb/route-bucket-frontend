import { useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import { Position, Route, FocusedMarkerInfo } from "../../types";
import { MarkerIcon, GoalMarkerIcon, StartMarkerIcon } from "./markerIcon";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";

type MakersProps = {
  changeCenterFlag: boolean;
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
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
function getMarkerIcon(idx: number, firstIdx: number, lastIdx: number) {
  switch (idx) {
    case firstIdx:
      return StartMarkerIcon;
    case lastIdx:
      return GoalMarkerIcon;
    default:
      return MarkerIcon;
  }
}

/**
 * map内でマーカーのJSX Elementを生成するための関数
 * @param pos マーカーのPosition
 * @param idx マーカーの順番
 * @param markerRefs マーカーのrefオブジェクト
 * @param props Markersのprops
 * @returns マーカーのJSX Element
 */
function markerGenerator(
  pos: Position,
  idx: number,
  markerRef: RefObject<MarkerType<any>>,
  props: MakersProps
) {
  const markerIcon = getMarkerIcon(idx, 0, props.route.waypoints.length - 1);
  markerRef = createRef<MarkerType>();
  async function onClickMarker(idx: number) {
    props.dispatchRoute({ type: "DELETE", targetIdx: idx });
  }

  async function onDragMarker(idx: number) {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint) {
      props.dispatchRoute({
        type: "MOVE",
        targetIdx: idx,
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
      });
    }
  }

  return (
    <Marker
      icon={markerIcon}
      zIndexOffset={idx === 0 ? props.route.waypoints.length * 100 : idx * 100}
      ref={markerRef}
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
      }} //TODO: ここの関数を一つにまとめたい
    ></Marker>
  );
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
  const markers = props.route.waypoints.map((pos: Position, idx: number) => {
    return markerGenerator(pos, idx, markerRefs.current[idx], props);
  });
  return <>{markers}</>;
}
