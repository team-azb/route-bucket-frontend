import { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";
import EditableNameDisplay from "../EditableNameDisplay";
import ElevationGraph from "../ElevationGraph";
import { config } from "../../config";
import { Route, FocusedMarkerInfo, DrawingMode } from "../../types";
import { meters2kilometers } from "../../utils";
import {
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Typography,
} from "@mui/material";

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
  const onClickClearHandler = () => {
    const approval = window.confirm(
      "経路をクリアします。(クリアの取り消しはできません)\nよろしいですか？"
    );
    approval && props.setIsLoading(true);
    props.dispatchRoute({
      type: "CLEAR",
      id: props.routeId,
    });
  };

  const onClickUndoHandler = () => {
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "UNDO",
      id: props.routeId,
    });
  };

  const onClickRedoHandler = () => {
    props.setIsLoading(true);
    props.dispatchRoute({
      type: "REDO",
      id: props.routeId,
    });
  };

  const onClickExportHandler = () => {
    window.open(`${config.BACKEND_ORIGIN}/routes/${props.routeId}/gpx/`);
  };

  const onClickGoIndexPageHandler = () => {
    history.push("/");
  };

  const onChangeDrawingModeRadioHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.value) {
      case "follow_road":
        props.setDrawingMode("follow_road");
        break;
      case "freehand":
        props.setDrawingMode("freehand");
        break;
      default:
        props.setDrawingMode("follow_road");
        break;
    }
  };
  return (
    <div style={{ background: "#fff", opacity: 0.85 }}>
      <div style={{ padding: props.isInsideMap ? 20 : 5 }}>
        <Button variant="contained" onClick={onClickGoIndexPageHandler}>
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
          onChange={onChangeDrawingModeRadioHandler}
          value={props.drawingMode}
        >
          <FormControlLabel
            value="follow_road"
            control={<Radio />}
            label="自動補間"
          />
          <FormControlLabel
            value="freehand"
            control={<Radio />}
            label="フリーハンド"
          />
        </RadioGroup>
        <Button variant="outlined" onClick={onClickUndoHandler}>
          undo
        </Button>
        <Button variant="outlined" onClick={onClickRedoHandler}>
          redo
        </Button>
        <Button variant="outlined" onClick={onClickClearHandler}>
          clear
        </Button>
        <Button variant="outlined" onClick={onClickExportHandler}>
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
