import L from "leaflet";
import { ORIGIN, pagePaths } from "../../consts/uriComponents";

//TODO: 環境変数にしてビルド環境によってURL切り替える
export const MarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.MARKER_ICON,
  iconRetinaUrl: ORIGIN + pagePaths.MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const GoalMarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.GOAL_MARKER_ICON,
  iconRetinaUrl: ORIGIN + pagePaths.GOAL_MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const StartMarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.START_MARKER_ICON,
  iconRetinaUrl: ORIGIN + pagePaths.START_MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});
