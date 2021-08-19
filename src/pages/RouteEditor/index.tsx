import { useState, useEffect, FunctionComponent } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import { LatLng, LeafletMouseEvent } from "leaflet";
import {
  getRoute,
  patchAdd,
  patchUndo,
  patchRedo,
  patchClear,
} from "../../api/routes";
import Markers from "../../components/Markers";
import Polylines from "../../components/Polylines";
import EditableNameDisplay from "../../components/EditableNameDisplay";
import ElevationGraph from "../../components/ElevationGraph";
import FocusedMarker from "../../components/FocusedMarker";
import { Route, FocusedMarkerInfo } from "../../types";
import "leaflet/dist/leaflet.css";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
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

function ClickLayer(props: ClickLayerProps): null {
  useMapEvent("click", async (e: LeafletMouseEvent) => {
    const res = await patchAdd(props.route.id, props.route.waypoints.length, {
      coord: {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    });
    if (res) {
      props.setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  });
  return null;
}

const RouteEditor: FunctionComponent = () => {
  const { routeId } = useParams<RouteEditorParams>();
  const [route, setRoute] = useState<Route>({
    id: routeId,
    name: "",
    waypoints: [],
    segments: [],
    elevation_gain: 0,
  });
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
    let unmounted = false;
    (async () => {
      const res = await getRoute(routeId);
      if (res && !unmounted) {
        setRoute({ ...res.data });
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [routeId]);

  async function onClickClearHandler(): Promise<void> {
    const res = await patchClear(routeId);
    if (res) {
      setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  }

  async function onClickUndoHandler(): Promise<void> {
    const res = await patchUndo(routeId);
    if (res) {
      setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  }

  async function onClickRedoHandler(): Promise<void> {
    const res = await patchRedo(routeId);
    if (res) {
      setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  }

  return (
    <>
      <Link to="/">ルート一覧へ</Link>
      <hr />
      <p>ルートid: {routeId}</p>

      <EditableNameDisplay route={route} setRoute={setRoute} />

      <p>獲得標高: {route.elevation_gain}m</p>
      <MapContainer
        style={{ height: "600px" }}
        center={[35.68139740310467, 139.7671569841016]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers
          changeCenterFlag={changeCenterFlag}
          route={route}
          setRoute={setRoute}
          setChangeCenterFlag={setChangeCenterFlag}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
        />
        <Polylines
          setZoomSize={setZoomSize}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
          route={route}
          setRoute={setRoute}
        />
        <FocusedMarker
          zoomSize={zoomSize}
          route={route}
          setRoute={setRoute}
          FocusedMarkerInfo={FocusedMarkerInfo}
          setFocusedMarkerInfo={setFocusedMarkerInfo}
        />
        <ClickLayer route={route} setRoute={setRoute} />
      </MapContainer>
      {/* Todo undoできない時はボタンをdisabledにする */}
      <button onClick={onClickUndoHandler}>undo</button>
      {/* Todo redoできない時はボタンをdisabledにする */}
      <button onClick={onClickRedoHandler}>redo</button>
      <button onClick={onClickClearHandler}>clear</button>
      <ElevationGraph
        segments={route.segments}
        FocusedMarkerInfo={FocusedMarkerInfo}
        setFocusedMarkerInfo={setFocusedMarkerInfo}
      />
    </>
  );
};

export default RouteEditor;
