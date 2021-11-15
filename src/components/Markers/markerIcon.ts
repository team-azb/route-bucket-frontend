import L from "leaflet";
import { staticFileUrls } from "../../consts/path";

//TODO: 環境変数にしてビルド環境によってURL切り替える
export const MarkerIcon = new L.Icon({
  iconUrl: staticFileUrls.MARKER_ICON,
  iconRetinaUrl: staticFileUrls.MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const GoalMarkerIcon = new L.Icon({
  iconUrl: staticFileUrls.GOAL_MARKER_ICON,
  iconRetinaUrl: staticFileUrls.GOAL_MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const StartMarkerIcon = new L.Icon({
  iconUrl: staticFileUrls.START_MARKER_ICON,
  iconRetinaUrl: staticFileUrls.START_MARKER_ICON,
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});
