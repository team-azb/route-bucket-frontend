import { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import EditableNameDisplay from "../EditableNameDisplay";
import ElevationGraph from "../ElevationGraph";
import { config } from "../../../config";
import { Route, FocusedMarkerInfo, DrawingMode } from "../../../types";
import { meters2kilometers } from "../../../utils";
import { pagePaths } from "../../../consts/uriComponents";
import "./style.css";

type RouteEditControllerProps = {
  isInsideMap: boolean;
  routeId: string;
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawingMode: DrawingMode;
  setDrawingMode: React.Dispatch<React.SetStateAction<DrawingMode>>;
};

function RouteEditControllerDisplay(props: RouteEditControllerProps) {
  const history = useHistory();
  const clearHandler = () => {
    const approval = window.confirm(
      "経路をクリアします。(クリアの取り消しはできません)\nよろしいですか？"
    );
    if (approval) {
      props.setIsLoading(true);
      props.dispatchRoute({
        type: "CLEAR",
      });
    }
  };

  const undoHandler = () => {
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "UNDO",
    });
  };

  const redoHandler = () => {
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "REDO",
    });
  };

  const exportGpxHandler = () => {
    window.open(`${config.BACKEND_ORIGIN}/routes/${props.routeId}/gpx/`);
  };

  const moveToIndexPageHandler = () => {
    history.push(pagePaths.ROUTE_INDEX);
  };

  const changeDrawingModeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setDrawingMode(event.target.value as DrawingMode);
  };
  return (
    <div style={{ background: "#fff", opacity: 0.85 }}>
      <div style={{ padding: props.isInsideMap ? 20 : 5 }}>
        <button
          className="controller__back-btn"
          onClick={moveToIndexPageHandler}
        >
          {"< ルート一覧へ"}
        </button>
        <hr />
        <p>ルートid: {props.routeId}</p>
        <EditableNameDisplay
          route={props.route}
          dispatchRoute={props.dispatchRoute}
        />
        <p>
          総距離: {meters2kilometers(props.route.total_distance).toFixed(2)}km
        </p>
        <p>獲得標高: {props.route.elevation_gain}m</p>
        <hr />
        <p className="controller__radio-group--title">ルート作成モード</p>
        <div className="controller__radio-group--container">
          <input
            className="controller__radio-group--radio"
            type="radio"
            id="followRoad"
            name="drawingMode"
            value={DrawingMode.FOLLOW_ROAD}
            onChange={changeDrawingModeHandler}
            checked={props.drawingMode === DrawingMode.FOLLOW_ROAD}
          />
          <label
            className="controller__radio-group--label"
            htmlFor="followRoad"
          >
            自動補間
          </label>
          <input
            className="controller__radio-group--radio"
            type="radio"
            id="freehand"
            name="drawingMode"
            value={DrawingMode.FREEHAND}
            onChange={changeDrawingModeHandler}
            checked={props.drawingMode === DrawingMode.FREEHAND}
          />
          <label className="controller__radio-group--label" htmlFor="freehand">
            フリーハンド
          </label>
        </div>
        <button className="controller__operation-btn" onClick={undoHandler}>
          undo
        </button>
        <button className="controller__operation-btn" onClick={redoHandler}>
          redo
        </button>
        <button className="controller__operation-btn" onClick={clearHandler}>
          clear
        </button>
        <button
          className="controller__operation-btn"
          onClick={exportGpxHandler}
        >
          export as gpx
        </button>
      </div>
      <ElevationGraph
        segments={props.route.segments}
        focusedMarkerInfo={props.focusedMarkerInfo}
        setFocusedMarkerInfo={props.setFocusedMarkerInfo}
      />
    </div>
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
            className="leaflet-control leaflet-bar"
            style={{ width: 600 }}
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
