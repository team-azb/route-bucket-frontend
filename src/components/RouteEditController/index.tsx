import { useRef, useEffect } from "react";
import L from "leaflet";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";
import EditableNameDisplay from "../EditableNameDisplay";
import ElevationGraph from "../ElevationGraph";
import { config } from "../../config";
import { Route, FocusedMarkerInfo } from "../../types";
import "./index.css";

type RouteEditControllerProps = {
  isInsideMap: boolean;
  routeId: string;
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

function RouteEditControllerDisplay(props: RouteEditControllerProps) {
  const onClickClearHandler = () => {
    props.dispatchRoute({ type: "CLEAR", id: props.routeId });
  };

  const onClickUndoHandler = () => {
    props.dispatchRoute({ type: "UNDO", id: props.routeId });
  };

  const onClickRedoHandler = () => {
    props.dispatchRoute({ type: "REDO", id: props.routeId });
  };

  function onClickExportHandler() {
    window.open(`${config.BACKEND_ORIGIN}/routes/${props.routeId}/gpx/`);
  }
  return (
    <>
      <div className="route-info-edit-container">
        <p>ルートid: {props.routeId}</p>
        <EditableNameDisplay
          route={props.route}
          dispatchRoute={props.dispatchRoute}
        />
        <p>総距離: {props.route.total_distance?.toFixed(0)}m</p>
        <p>獲得標高: {props.route.elevation_gain}m</p>
        <button onClick={onClickUndoHandler}>undo</button>
        <button onClick={onClickRedoHandler}>redo</button>
        <button onClick={onClickClearHandler}>clear</button>
        <button onClick={onClickExportHandler}>export as gpx</button>
      </div>
      <ElevationGraph
        segments={props.route.segments}
        focusedMarkerInfo={props.focusedMarkerInfo}
        setFocusedMarkerInfo={props.setFocusedMarkerInfo}
      />
    </>
  );
}

export default function RouteEditController(props: RouteEditControllerProps) {
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
        <div className={"leaflet-bottom leaflet-left"}>
          <div
            ref={divRef}
            className="leaflet-control leaflet-bar route-edit-controller-container"
          >
            <RouteEditControllerDisplay {...props} />
          </div>
        </div>
      ) : (
        <RouteEditControllerDisplay {...props} />
      )}
    </>
  );
}
