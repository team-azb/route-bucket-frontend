import { useState, useEffect, FunctionComponent } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent, useMap } from "react-leaflet";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet.locatecontrol";
import { useReducerAsync } from "use-reducer-async";
import Markers from "../../components/Markers";
import Polylines from "../../components/Polylines";
import EditableNameDisplay from "../../components/EditableNameDisplay";
import ElevationGraph from "../../components/ElevationGraph";
import FocusedMarker from "../../components/FocusedMarker";
import CurrentLacationMarker from "../../components/CurrentLocationMarker";
import { FocusedMarkerInfo } from "../../types";
import {
  routeReducer,
  routeAsyncActionHandlers,
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";
import { config } from "../../config";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
};

//URLのパラメータのinerface
interface RouteEditorParams {
  routeId: string;
}

const focusedMarkerInfoInitValue: FocusedMarkerInfo = {
  isDisplayed: false,
  idx: 0,
  position: new LatLng(0, 0),
};

//現在地表示に関するオプション
const locateOption: L.Control.LocateOptions = {
  position: "topright",
  strings: {
    title: "現在地を表示",
    popup: "現在地",
  },
  locateOptions: {
    maxZoom: 16,
  },
  markerStyle: {
    zIndexOffset: 100, //現在地表示のアイコンは一番前に出す
  },
};

// Memo: 地図を切り替えるたびに読み込まれてしまう
// Todo: 現在地の読み込みが遅い(ブラウザの組み込みapiの方が圧倒的に早い)のを改善
function LocateController() {
  const map = useMap();
  useEffect(() => {
    L.control.locate(locateOption).addTo(map);
  }, [map]);
  return <></>;
}

function ClickLayer(props: ClickLayerProps) {
  useMapEvent("click", async (e: LeafletMouseEvent) => {
    props.dispatchRoute({
      type: "APPEND",
      coord: {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    });
  });
  return <></>;
}

const RouteEditor: FunctionComponent = () => {
  const { routeId } = useParams<RouteEditorParams>();
  const [route, dispatchRoute] = useReducerAsync(
    routeReducer,
    {
      id: routeId,
      name: "",
      waypoints: [],
      segments: [],
      elevation_gain: 0,
    },
    routeAsyncActionHandlers
  );
  const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(false);
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [FocusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );

  useEffect(() => {
    setFocusedMarkerInfo(focusedMarkerInfoInitValue);
  }, [route]);

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    dispatchRoute({ type: "GET", id: routeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  function onClickClearHandler() {
    dispatchRoute({ type: "CLEAR", id: routeId });
  }

  function onClickUndoHandler() {
    dispatchRoute({ type: "UNDO", id: routeId });
  }

  function onClickRedoHandler() {
    dispatchRoute({ type: "REDO", id: routeId });
  }

  function onClickExportHandler() {
    window.open(`${config.BACKEND_ORIGIN}/routes/${routeId}/gpx/`);
  }

  return (
    <>
      <Link to="/">ルート一覧へ</Link>
      <hr />
      <p>ルートid: {routeId}</p>

      <EditableNameDisplay route={route} dispatchRoute={dispatchRoute} />

      <p>獲得標高: {route.elevation_gain}m</p>
      <MapContainer
        style={{ height: "600px" }}
        center={[35.68139740310467, 139.7671569841016]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <LocateController />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers
          changeCenterFlag={changeCenterFlag}
          route={route}
          dispatchRoute={dispatchRoute}
          setChangeCenterFlag={setChangeCenterFlag}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
        />
        <Polylines
          setZoomSize={setZoomSize}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
          route={route}
        />
        <FocusedMarker
          zoomSize={zoomSize}
          route={route}
          dispatchRoute={dispatchRoute}
          FocusedMarkerInfo={FocusedMarkerInfo}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
        />
        <CurrentLacationMarker zoomSize={zoomSize} />
        <ClickLayer dispatchRoute={dispatchRoute} />
      </MapContainer>
      {/* TODO undoできない時はボタンをdisabledにする */}
      <button onClick={onClickUndoHandler}>undo</button>
      {/* TODO redoできない時はボタンをdisabledにする */}
      <button onClick={onClickRedoHandler}>redo</button>
      <button onClick={onClickClearHandler}>clear</button>
      <button onClick={onClickExportHandler}>export as gpx</button>
      <ElevationGraph
        segments={route.segments}
        FocusedMarkerInfo={FocusedMarkerInfo}
        setFocusedMarkerInfo={setFocusedMarkerInfo}
      />
    </>
  );
};

export default RouteEditor;
