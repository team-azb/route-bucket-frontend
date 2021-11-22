import L from "leaflet";
import { ORIGIN, pagePaths } from "../../../consts/uriComponents";

/**
 *
 * @param size アイコンの大きさ
 * @returns L.Iconインスタンス
 */
export const FocusedMarkerIcon = (size: number) => {
  return new L.Icon({
    iconUrl: ORIGIN + pagePaths.FOCUSED_MARKER_ICON,
    iconRetinaUrl: ORIGIN + pagePaths.FOCUSED_MARKER_ICON,
    iconSize: new L.Point(size, size),
  });
};
