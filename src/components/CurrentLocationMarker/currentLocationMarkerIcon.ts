import L from "leaflet";

/**
 *
 * @param size アイコンの大きさ
 * @returns L.Iconインスタンス
 */
export const CurrentLocationMarkerIcon = (size: number) => {
  return new L.Icon({
    iconUrl: "icons/my_location_black_24dp.svg",
    iconRetinaUrl: "icons/my_location_black_24dp.svg",
    iconSize: new L.Point(size * 1.5, size * 1.5),
  });
};
