import { CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet.locatecontrol";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useReducerAsync } from "use-reducer-async";
import { useAuthenticationInfoContext } from "../../../contexts/AuthenticationProvider";
import { useWindowDimensions } from "../../../hooks/windowDimensions";
import {
  routeAsyncActionHandlers,
  routeReducer,
} from "../../../reducers/routeReducer";
import FocusedMarker from "../../organisms/FocusedMarker";
import { HEADER_HEIGHT_PX } from "../../organisms/Header";
import Markers from "../../organisms/Markers";
import Polylines from "../../organisms/Polylines";
import RouteEditController from "../../organisms/RouteEditingController";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import styles from "./style.module.css";
import { DrawingMode, FocusedMarkerInfo } from "../../../types";

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

const RouteViewer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [focusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(
    DrawingMode.FOLLOW_ROAD
  );

  const { routeId } = useParams<RouteEditorParams>();
  const [route, dispatchRoute] = useReducerAsync(
    routeReducer,
    {
      id: routeId,
      name: "",
      owner_id: "",
      waypoints: [],
      segments: [],
      total_distance: 0,
      elevation_gain: 0,
      isLoaded: false,
    },
    routeAsyncActionHandlers
  );

  const { getIdToken } = useAuthenticationInfoContext();

  useEffect(() => {
    // setFocusedMarkerInfo(focusedMarkerInfoInitValue);
    //routeに変更が見られたらrouteのローディングが完了したものとし、isLoadingをfalseにする
    setIsLoading(false);
    if (route.error) {
      toast.error(route.error.message);
    }
  }, [route]);

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      setIsLoading(true);
      dispatchRoute({
        type: "GET",
        id: routeId,
        token: token,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  const { width, height } = useWindowDimensions();
  const mapHeight = useMemo(() => {
    return height - HEADER_HEIGHT_PX;
  }, [height]);
  const isMobile = useMemo(() => {
    return width < 600;
  }, [width]);

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
            <p className={styles.loadingText}>ルート取得中</p>
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
            setIsLoading={setIsLoading}
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
            setIsLoading={setIsLoading}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
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

export default RouteViewer;
