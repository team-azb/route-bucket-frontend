import { useState, useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import {
  RoutePoint,
  Route,
  FocusedMarkerInfo,
  DrawingMode,
} from "../../../types";
import { MarkerIcon, GoalMarkerIcon, StartMarkerIcon } from "./markerIcon";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";

type MakersProps = {
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawingMode: DrawingMode;
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
  pos: RoutePoint,
  idx: number,
  markerRef: RefObject<MarkerType>,
  props: MakersProps
) {
  const markerIcon = getMarkerIcon(idx, 0, props.route.waypoints.length - 1);
  markerRef = createRef<MarkerType>();
  async function clickMarkerHandler(idx: number) {
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "REMOVE",
      targetIdx: idx,
      mode: props.drawingMode,
    });
  }

  async function dragMarkerHandler(idx: number) {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint) {
      props.setIsLoading(true);
      props.dispatchRoute({
        type: "MOVE",
        targetIdx: idx,
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
        mode: props.drawingMode,
      });
    }
  }

  return (
    <Marker
      icon={markerIcon}
      zIndexOffset={
        idx === 0 || idx === props.route.waypoints.length - 1 ? 50 : 10
      } //スタートとゴールのアイコンは前面に出す
      ref={markerRef}
      draggable={true}
      position={[pos.latitude, pos.longitude]}
      key={nanoid()}
      eventHandlers={{
        click: () => {
          clickMarkerHandler(idx);
        },
        dragend: () => {
          dragMarkerHandler(idx);
        },
      }} //TODO: ここの関数を一つにまとめたい
    ></Marker>
  );
}

export default function Markers(props: MakersProps) {
  const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(true);
  const map = useMap();
  const markerRefs = useRef<Array<RefObject<MarkerType>>>(
    Array(props.route.waypoints.length)
  );

  useEffect(() => {
    if (changeCenterFlag && props.route.isLoaded) {
      if (props.route.bounding_box) {
        map.fitBounds([
          [
            props.route.bounding_box.min_coord.latitude,
            props.route.bounding_box.min_coord.longitude,
          ],
          [
            props.route.bounding_box.max_coord.latitude,
            props.route.bounding_box.max_coord.longitude,
          ],
        ]);
      }
      setChangeCenterFlag(false);
    }
  }, [props.route]);
  const markers = props.route.waypoints.map((pos: RoutePoint, idx: number) => {
    return markerGenerator(pos, idx, markerRefs.current[idx], props);
  });
  return <>{markers}</>;
}
