import {
  useState,
  useEffect,
  FunctionComponent,
  useMemo,
  SetStateAction,
} from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent, useMap } from "react-leaflet";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet.locatecontrol";
import { useReducerAsync } from "use-reducer-async";
import Markers from "../../components/Markers";
import Polylines from "../../components/Polylines";
import FocusedMarker from "../../components/FocusedMarker";
import RouteEditController from "../../components/RouteEditController";
import { FocusedMarkerInfo } from "../../types";
import {
  routeReducer,
  routeAsyncActionHandlers,
  routeReducerAction,
  routeAsyncAction,
} from "../../reducers/routeReducer";
import { useWindowDimensions } from "../../hooks/windowDimensions";
import CircularProgress from "@mui/material/CircularProgress";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
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
  position: "topleft",
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
    props.isLoading ||
      props.dispatchRoute({
        type: "APPEND",
        coord: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
        setIsLoading: props.setIsLoading,
      });
  });
  return <></>;
}

const RouteEditor: FunctionComponent = () => {
  const { width, height } = useWindowDimensions();
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
      elevation_gain: 0,
    },
    routeAsyncActionHandlers
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(false);
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [focusedMarkerInfo, setFocusedMarkerInfo] = useState<FocusedMarkerInfo>(
    focusedMarkerInfoInitValue
  );

  useEffect(() => {
    setFocusedMarkerInfo(focusedMarkerInfoInitValue);
  }, [route]);

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    dispatchRoute({
      type: "GET",
      id: routeId,
      setChangeCenterFlag: setChangeCenterFlag,
      setIsLoading: setIsLoading,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  return (
    <>
      <div>
        {isLoading && (
          <div
            // TODO: styleをCSSとかにまとめるかstyled component使う
            style={{
              zIndex: 2000,
              background: "#fff",
              opacity: 0.7,
              position: "absolute",
              top: 0,
              left: 0,
              width: width,
              height: isMobile ? height * 0.8 : height,
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* FIXME: opacityがCircularProgressなどにも適用されてしまう */}
            <CircularProgress />
            <p style={{ fontWeight: "bold" }}>ルート計算中</p>
          </div>
        )}
        <MapContainer
          style={{ width: width, height: isMobile ? height * 0.8 : height }}
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
            setIsLoading={setIsLoading}
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
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            setIsLoading={setIsLoading}
          />
          <ClickLayer
            dispatchRoute={dispatchRoute}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          {!isMobile && (
            <RouteEditController
              isInsideMap={true}
              routeId={routeId}
              route={route}
              dispatchRoute={dispatchRoute}
              focusedMarkerInfo={focusedMarkerInfo}
              setFocusedMarkerInfo={setFocusedMarkerInfo}
              setIsLoading={setIsLoading}
            />
          )}
        </MapContainer>
        {isMobile && (
          <RouteEditController
            isInsideMap={false}
            routeId={routeId}
            route={route}
            dispatchRoute={dispatchRoute}
            focusedMarkerInfo={focusedMarkerInfo}
            setFocusedMarkerInfo={setFocusedMarkerInfo}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </>
  );
};

export default RouteEditor;
