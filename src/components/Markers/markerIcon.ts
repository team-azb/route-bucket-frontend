import L from "leaflet";

//TODO: 環境変数にしてビルド環境によってURL切り替える
export const MarkerIcon = new L.Icon({
  iconUrl: "http://localhost:3000/icons/fmd_good_black_24dp.svg",
  iconRetinaUrl: "http://localhost:3000/icons/fmd_good_black_24dp.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const GoalMarkerIcon = new L.Icon({
  iconUrl: "http://localhost:3000/icons/goal_pin.svg",
  iconRetinaUrl: "http://localhost:3000/icons/goal_pin.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const StartMarkerIcon = new L.Icon({
  iconUrl: "http://localhost:3000/icons/start_pin.svg",
  iconRetinaUrl: "http://localhost:3000/icons/start_pin.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});
