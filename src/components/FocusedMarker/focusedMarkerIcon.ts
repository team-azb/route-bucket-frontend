import L from "leaflet";

/**
 *
 * @param size アイコンの大きさ
 * @returns L.Iconインスタンス
 */
export const FocusedMarkerIcon = (size: number) => {
  return new L.Icon({
    iconUrl: "icons/circle_black_24dp.svg",
    iconRetinaUrl: "icons/circle_black_24dp.svg",
    iconSize: new L.Point(size, size),
  });
};
