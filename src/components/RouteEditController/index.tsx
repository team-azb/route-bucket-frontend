import { useRef, useEffect } from "react";
import L from "leaflet";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";
import { config } from "../../config";

type RouteEditControllerProps = {
  routeId: string;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
};

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export default function RouteEditController(props: RouteEditControllerProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current && L.DomEvent.disableClickPropagation(divRef.current);
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
  const positionClass =
    POSITION_CLASSES["bottomleft"] || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div ref={divRef} className="leaflet-control leaflet-bar">
        <button onClick={onClickUndoHandler}>undo</button>
        <button onClick={onClickRedoHandler}>redo</button>
        <button onClick={onClickClearHandler}>clear</button>
        <button onClick={onClickExportHandler}>export as gpx</button>
      </div>
    </div>
  );
}
