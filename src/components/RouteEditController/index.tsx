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
  routeId: string;
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

export default function RouteEditController(props: RouteEditControllerProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
      L.DomEvent.disableScrollPropagation(divRef.current);
    }
  });

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
    <div className={"leaflet-bottom leaflet-left"}>
      <div
        ref={divRef}
        className="leaflet-control leaflet-bar route-edit-controller-container"
      >
        <div className="route-info-edit-container">
          <p>ルートid: {props.routeId}</p>
          <EditableNameDisplay
            route={props.route}
            dispatchRoute={props.dispatchRoute}
          />
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
      </div>
    </div>
  );
}
