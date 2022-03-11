import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMapEvent, useMap } from "react-leaflet";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet.locatecontrol";
import EditableMarkers from "../../organisms/EditableMarkers";
import Polylines from "../../organisms/Polylines";
import EditableFocusedMarker from "../../organisms/EditableFocusedMarker";
import RouteEditingController from "../../organisms/RouteEditingController";
import { FocusedMarkerInfo, DrawingMode, Route } from "../../../types";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import { useWindowDimensions } from "../../../hooks/windowDimensions";
import CircularProgress from "@mui/material/CircularProgress";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import { HEADER_HEIGHT_PX } from "../../organisms/Header";
import styles from "./style.module.css";
import { useAuthenticationInfoContext } from "../../../contexts/AuthenticationProvider";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawingMode: DrawingMode;
};

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
  const { getIdToken } = useAuthenticationInfoContext();
  useMapEvent("click", async (e: LeafletMouseEvent) => {
    const token = await getIdToken();
    props.isLoading || props.setIsLoading(true);
    props.dispatchRoute({
      type: "APPEND",
      coord: {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
      mode: props.drawingMode,
      token: token,
    });
  });
  return <></>;
}

type RouteEditorProps = {
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const RouteEditor = (props: RouteEditorProps) => {
  const { width, height } = useWindowDimensions();
  const mapHeight = useMemo(() => {
    return height - HEADER_HEIGHT_PX;
  }, [height]);
  const isMobile = useMemo(() => {
    return width < 600;
  }, [width]);

  const [zoomSize, setZoomSize] = useState<number>(13);
  const [focusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(
    DrawingMode.FOLLOW_ROAD
  );

  useEffect(() => {
    setFocusedMarkerInfo(focusedMarkerInfoInitValue);
  }, [props.route]);

  return (
    <SignInRequiredTemplate>
      <div className={styles.loadingWrapper}>
        {props.isLoading && (
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
              {props.route.isLoaded ? "ルート計算中" : "ルート取得中"}
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
          <EditableMarkers
            route={props.route}
            dispatchRoute={props.dispatchRoute}
            setIsLoading={props.setIsLoading}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            drawingMode={drawingMode}
          />
          <Polylines
            setZoomSize={setZoomSize}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            route={props.route}
          />
          <EditableFocusedMarker
            zoomSize={zoomSize}
            route={props.route}
            dispatchRoute={props.dispatchRoute}
            setIsLoading={props.setIsLoading}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            drawingMode={drawingMode}
          />
          <ClickLayer
            dispatchRoute={props.dispatchRoute}
            isLoading={props.isLoading}
            setIsLoading={props.setIsLoading}
            drawingMode={drawingMode}
          />
          {!isMobile && (
            <RouteEditingController
              isInsideMap={true}
              routeId={props.route.id}
              route={props.route}
              dispatchRoute={props.dispatchRoute}
              setIsLoading={props.setIsLoading}
              focusedMarkerInfo={focusedMarkerInfo}
              setFocusedMarkerInfo={setFocusedMarkerInfo}
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
            />
          )}
        </MapContainer>
        {isMobile && (
          <RouteEditingController
            isInsideMap={false}
            routeId={props.route.id}
            route={props.route}
            dispatchRoute={props.dispatchRoute}
            setIsLoading={props.setIsLoading}
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
