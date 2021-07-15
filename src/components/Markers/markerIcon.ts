import L from "leaflet";

export const MarkerIcon = new L.Icon({
  iconUrl: "icons/flag_black_24dp.svg",
  iconRetinaUrl: "icons/flag_black_24dp.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(10, 36),
});

export const GoalMarkerIcon = new L.Icon({
  iconUrl: "icons/goal_pin.svg",
  iconRetinaUrl: "icons/goal_pin.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});

export const StartMarkerIcon = new L.Icon({
  iconUrl: "icons/start_pin.svg",
  iconRetinaUrl: "icons/start_pin.svg",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 36),
});
