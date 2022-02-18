import { CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet.locatecontrol";
import { toast } from "react-toastify";
import { useWindowDimensions } from "../../../hooks/windowDimensions";
import FocusedMarker from "../../organisms/FocusedMarker";
import { HEADER_HEIGHT_PX } from "../../organisms/Header";
import Markers from "../../organisms/Markers";
import Polylines from "../../organisms/Polylines";
import RouteViewingController from "../../organisms/RouteViewingController";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import styles from "./style.module.css";
import { FocusedMarkerInfo, Route } from "../../../types";

type RouteViewerProps = {
  route: Route;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

const RouteViewer = (props: RouteViewerProps) => {
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [focusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );

  useEffect(() => {
    setFocusedMarkerInfo(focusedMarkerInfoInitValue);
    //routeに変更が見られたらrouteのローディングが完了したものとし、isLoadingをfalseにする
    props.setIsLoading(false);
    if (props.route.error) {
      toast.error(props.route.error.message);
    }
  }, [props]);

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
            route={props.route}
            setIsLoading={props.setIsLoading}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
          />
          <Polylines
            setZoomSize={setZoomSize}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            route={props.route}
          />
          <FocusedMarker
            zoomSize={zoomSize}
            setIsLoading={props.setIsLoading}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
          />
          {!isMobile && (
            <RouteViewingController
              isInsideMap={true}
              routeId={props.route.id}
              route={props.route}
              focusedMarkerInfo={focusedMarkerInfo}
              setFocusedMarkerInfo={setFocusedMarkerInfo}
            />
          )}
        </MapContainer>
        {isMobile && (
          <RouteViewingController
            isInsideMap={true}
            routeId={props.route.id}
            route={props.route}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
          />
        )}
      </div>
    </SignInRequiredTemplate>
  );
};

export default RouteViewer;
