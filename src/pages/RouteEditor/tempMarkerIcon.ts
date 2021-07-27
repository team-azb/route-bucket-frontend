import L from "leaflet";

export const TempMarkerIcon = (zoomSize: number) => {
  return new L.Icon({
    iconUrl: "icons/circle_black_24dp.svg",
    iconRetinaUrl: "icons/circle_black_24dp.svg",
    iconSize: new L.Point(zoomSize, zoomSize),
  });
};
