import { useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import EditableNameDisplay from "../EditableNameDisplay";
import ElevationGraph from "../ElevationGraph";
import DrawingModeRadio from "../DrawingModeRadio";
import OperationButton from "../../atoms/OperationButton";
import { config } from "../../../config";
import { Route, FocusedMarkerInfo, DrawingMode } from "../../../types";
import { meters2kilometers } from "../../../utils";
import { pagePaths } from "../../../consts/uriComponents";
import styles from "./style.module.css";
import { useAuthenticationInfoContext } from "../../../contexts/AuthenticationProvider";

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
  const { getIdToken } = useAuthenticationInfoContext();

  const clearHandler = async () => {
    const approval = window.confirm(
      "経路をクリアします。(クリアの取り消しはできません)\nよろしいですか？"
    );
    if (approval) {
      const token = await getIdToken();
      props.setIsLoading(true);
      props.dispatchRoute({
        type: "CLEAR",
        token: token,
      });
    }
  };

  const undoHandler = async () => {
    const token = await getIdToken();
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "UNDO",
      token: token,
    });
  };

  const redoHandler = async () => {
    const token = await getIdToken();
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "REDO",
      token: token,
    });
  };

  const exportGpxHandler = () => {
    window.open(`${config.BACKEND_ORIGIN}/routes/${props.routeId}/gpx/`);
  };

  const moveToIndexPageHandler = () => {
    history.push(pagePaths.ROUTE_INDEX);
  };

  const changeDrawingModeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setDrawingMode(event.target.value as DrawingMode);
    },
    [props]
  );
  return (
    <div style={{ background: "#fff", opacity: 0.85 }}>
      <div style={{ padding: props.isInsideMap ? 20 : 5 }}>
        <button className={styles.backBtn} onClick={moveToIndexPageHandler}>
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
        <p className={styles.radioGroupTitle}>ルート作成モード</p>
        <div className={styles.radioGroupContainer}>
          <DrawingModeRadio
            id="followRoad"
            value={DrawingMode.FOLLOW_ROAD}
            onChange={changeDrawingModeHandler}
            checked={props.drawingMode === DrawingMode.FOLLOW_ROAD}
          >
            自動補間
          </DrawingModeRadio>
          <DrawingModeRadio
            id="freehand"
            value={DrawingMode.FREEHAND}
            onChange={changeDrawingModeHandler}
            checked={props.drawingMode === DrawingMode.FREEHAND}
          >
            フリーハンド
          </DrawingModeRadio>
        </div>
        <OperationButton onClick={undoHandler}>undo</OperationButton>
        <OperationButton onClick={redoHandler}>redo</OperationButton>
        <OperationButton onClick={clearHandler}>clear</OperationButton>
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
        <div className="leaflet-bottom leaflet-left">
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
