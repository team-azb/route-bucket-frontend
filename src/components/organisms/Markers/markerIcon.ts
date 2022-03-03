import L from "leaflet";
import { ORIGIN, pagePaths } from "../../../consts/uriComponents";

//TODO: 環境変数にしてビルド環境によってURL切り替える
export const MarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.markerIcon(),
  iconRetinaUrl: ORIGIN + pagePaths.markerIcon(),
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const GoalMarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.goalMarkerIcon(),
  iconRetinaUrl: ORIGIN + pagePaths.goalMarkerIcon(),
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const StartMarkerIcon = new L.Icon({
  iconUrl: ORIGIN + pagePaths.startMarkerIcon(),
  iconRetinaUrl: ORIGIN + pagePaths.startMarkerIcon(),
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});
