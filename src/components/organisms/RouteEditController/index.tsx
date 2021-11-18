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
import {
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Typography,
} from "@mui/material";
import { pagePaths } from "../../../consts/uriComponents";

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
        <Button variant="contained" onClick={moveToIndexPageHandler}>
          {"< ルート一覧へ"}
        </Button>
        <hr />
        <Typography>ルートid: {props.routeId}</Typography>
        <EditableNameDisplay
          route={props.route}
          dispatchRoute={props.dispatchRoute}
        />
        <Typography>
          総距離: {meters2kilometers(props.route.total_distance).toFixed(2)}km
        </Typography>
        <Typography>獲得標高: {props.route.elevation_gain}m</Typography>
        <hr />
        <FormLabel component="legend">ルート作成モード</FormLabel>
        <RadioGroup
          row
          onChange={changeDrawingModeHandler}
          value={props.drawingMode}
        >
          <FormControlLabel
            value={DrawingMode.FOLLOW_ROAD}
            control={<Radio />}
            label="自動補間"
          />
          <FormControlLabel
            value={DrawingMode.FREEHAND}
            control={<Radio />}
            label="フリーハンド"
          />
        </RadioGroup>
        <Button variant="outlined" onClick={undoHandler}>
          undo
        </Button>
        <Button variant="outlined" onClick={redoHandler}>
          redo
        </Button>
        <Button variant="outlined" onClick={clearHandler}>
          clear
        </Button>
        <Button variant="outlined" onClick={exportGpxHandler}>
          export as gpx
        </Button>
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
