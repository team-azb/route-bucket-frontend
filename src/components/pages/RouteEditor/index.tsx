import { useState, useEffect, FunctionComponent, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent, useMap } from "react-leaflet";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet.locatecontrol";
import { useReducerAsync } from "use-reducer-async";
import { toast } from "react-toastify";
import Markers from "../../organisms/Markers";
import Polylines from "../../organisms/Polylines";
import FocusedMarker from "../../organisms/FocusedMarker";
import RouteEditController from "../../organisms/RouteEditController";
import { FocusedMarkerInfo, DrawingMode } from "../../../types";
import {
  routeReducer,
  routeAsyncActionHandlers,
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import { useWindowDimensions } from "../../../hooks/windowDimensions";
import CircularProgress from "@mui/material/CircularProgress";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import { HEADER_HEIGHT_PX } from "../../organisms/Header";
import styles from "./style.module.css";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawingMode: DrawingMode;
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
    props.isLoading || props.setIsLoading(true);
    props.dispatchRoute({
      type: "APPEND",
      coord: {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
      mode: props.drawingMode,
    });
  });
  return <></>;
}

const RouteEditor: FunctionComponent = () => {
  const { width, height } = useWindowDimensions();
  const mapHeight = useMemo(() => {
    return height - HEADER_HEIGHT_PX;
  }, [height]);
  const isMobile = useMemo(() => {
    return width < 600;
  }, [width]);
  const { routeId } = useParams<RouteEditorParams>();
  const [route, dispatchRoute] = useReducerAsync(
    routeReducer,
    {
      id: routeId,
      name: "",
      waypoints: [],
      segments: [],
      total_distance: 0,
      elevation_gain: 0,
      isLoaded: false,
    },
    routeAsyncActionHandlers
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [focusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(
    DrawingMode.FOLLOW_ROAD
  );

  useEffect(() => {
    setFocusedMarkerInfo(focusedMarkerInfoInitValue);
    //routeに変更が見られたらrouteのローディングが完了したものとし、isLoadingをfalseにする
    setIsLoading(false);
    if (route.error) {
      toast.error(route.error.message);
    }
  }, [route]);

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    setIsLoading(true);
    dispatchRoute({
      type: "GET",
      id: routeId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  return (
    <SignInRequiredTemplate>
      <div className={styles.loadingWrapper}>
        {isLoading && (
          <div
            className={styles.loadingContainer}
            style={{
              width: width,
              height: isMobile ? mapHeight * 0.8 : mapHeight,
            }}
          >
            {/* FIXME: opacityがCircularProgressなどにも適用されてしまう */}
            <CircularProgress />
            <p className={styles.loadingText}>
              {route.isLoaded ? "ルート計算中" : "ルート取得中"}
            </p>
          </div>
        )}
        <MapContainer
          style={{
            width: width,
            height: isMobile ? mapHeight * 0.8 : mapHeight,
          }}
          center={[35.68139740310467, 139.7671569841016]}
          zoom={13}
          scrollWheelZoom={true}
          // tapをfalseにしないと、safariでクリックの挙動がおかしくなる
          // 参考：https://github.com/Leaflet/Leaflet/issues/7255
          tap={false}
        >
          <LocateController />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Markers
            route={route}
            dispatchRoute={dispatchRoute}
            setIsLoading={setIsLoading}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            drawingMode={drawingMode}
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
            setIsLoading={setIsLoading}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            drawingMode={drawingMode}
          />
          <ClickLayer
            dispatchRoute={dispatchRoute}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            drawingMode={drawingMode}
          />
          {!isMobile && (
            <RouteEditController
              isInsideMap={true}
              routeId={routeId}
              route={route}
              dispatchRoute={dispatchRoute}
              setIsLoading={setIsLoading}
              focusedMarkerInfo={focusedMarkerInfo}
              setFocusedMarkerInfo={setFocusedMarkerInfo}
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
            />
          )}
        </MapContainer>
        {isMobile && (
          <RouteEditController
            isInsideMap={false}
            routeId={routeId}
            route={route}
            dispatchRoute={dispatchRoute}
            setIsLoading={setIsLoading}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            drawingMode={drawingMode}
            setDrawingMode={setDrawingMode}
          />
        )}
      </div>
    </SignInRequiredTemplate>
  );
};

export default RouteEditor;
