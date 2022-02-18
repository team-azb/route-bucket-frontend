import { useState, useEffect, useRef, createRef, RefObject } from "react";
import { Marker, useMap } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { nanoid } from "nanoid";
import { RoutePoint, Route, FocusedMarkerInfo } from "../../../types";
import {
  MarkerIcon,
  GoalMarkerIcon,
  StartMarkerIcon,
} from "../EditableMarkers/markerIcon";

type MakersProps = {
  route: Route;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  markerRef: RefObject<MarkerType<any>>,
  props: MakersProps
) {
  const markerIcon = getMarkerIcon(idx, 0, props.route.waypoints.length - 1);
  markerRef = createRef<MarkerType>();

  return (
    <Marker
      icon={markerIcon}
      zIndexOffset={
        idx === 0 || idx === props.route.waypoints.length - 1 ? 50 : 10
      } //スタートとゴールのアイコンは前面に出す
      ref={markerRef}
      draggable={false}
      position={[pos.latitude, pos.longitude]}
      key={nanoid()}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route]);
  const markers = props.route.waypoints.map((pos: RoutePoint, idx: number) => {
    return markerGenerator(pos, idx, markerRefs.current[idx], props);
  });
  return <>{markers}</>;
}