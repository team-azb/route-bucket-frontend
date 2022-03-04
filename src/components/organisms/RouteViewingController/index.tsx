import { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import ElevationGraph from "../ElevationGraph";
import OperationButton from "../../atoms/OperationButton";
import { config } from "../../../config";
import { Route, FocusedMarkerInfo } from "../../../types";
import { meters2kilometers } from "../../../utils";
import { pagePaths } from "../../../consts/uriComponents";
import styles from "./style.module.css";

type RouteViewingControllerProps = {
  isInsideMap: boolean;
  routeId: string;
  route: Route;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

function RouteViewingControllerDisplay(props: RouteViewingControllerProps) {
  const history = useHistory();

  const exportGpxHandler = () => {
    window.open(`${config.BACKEND_ORIGIN}/routes/${props.routeId}/gpx/`);
  };

  const moveToIndexPageHandler = () => {
    history.push(pagePaths.ROUTE_INDEX);
  };

  return (
    <div style={{ background: "#fff", opacity: 0.85 }}>
      <div style={{ padding: props.isInsideMap ? 20 : 5 }}>
        <button className={styles.backBtn} onClick={moveToIndexPageHandler}>
          {"< ルート一覧へ"}
        </button>
        <hr />
        <p>ルートid: {props.routeId}</p>
        <p>ルート名: {props.route.name}</p>
        <p>
          総距離: {meters2kilometers(props.route.total_distance).toFixed(2)}km
        </p>
        <p>獲得標高: {props.route.elevation_gain}m</p>
        <hr />

        <OperationButton onClick={exportGpxHandler}>
          export as gpx
        </OperationButton>
      </div>
      <ElevationGraph
        segments={props.route.segments}
        focusedMarkerInfo={props.focusedMarkerInfo}
        setFocusedMarkerInfo={props.setFocusedMarkerInfo}
      />
    </div>
  );
}

export default function RouteViewingController(
  props: RouteViewingControllerProps
) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
      L.DomEvent.disableScrollPropagation(divRef.current);
    }
  });

  return (
    <>
      {props.isInsideMap ? (
        <div className="leaflet-bottom leaflet-left">
          <div
            ref={divRef}
            className="leaflet-control leaflet-bar"
            style={{ width: 600 }}
          >
            <RouteViewingControllerDisplay {...props} />
          </div>
        </div>
      ) : (
        <RouteViewingControllerDisplay {...props} />
      )}
    </>
  );
}
