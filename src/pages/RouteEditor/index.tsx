import { useState, useEffect, FunctionComponent } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
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
import ManipulatingMarker from "../../components/ManipulatingMarker";
import { Route, ManipulatingMarkerInfo } from "../../types";
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
  const [manipulatingMarkerInfo, setManipulatingMarkerInfo] =
    useState<ManipulatingMarkerInfo>({
      position: null,
      idx: null,
    });

  useEffect(() => {
    setManipulatingMarkerInfo({ idx: null, position: null });
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
          setManipulatingMarkerInfo={setManipulatingMarkerInfo}
        />
        <Polylines
          setZoomSize={setZoomSize}
          setManipulatingMarkerInfo={setManipulatingMarkerInfo}
          route={route}
          setRoute={setRoute}
        />
        <ManipulatingMarker
          zoomSize={zoomSize}
          route={route}
          setRoute={setRoute}
          manipulatingMarkerInfo={manipulatingMarkerInfo}
          setManipulatingMarkerInfo={setManipulatingMarkerInfo}
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
        manipulatingMarkerInfo={manipulatingMarkerInfo}
        setManipulatingMarkerInfo={setManipulatingMarkerInfo}
      />
    </>
  );
};

export default RouteEditor;
