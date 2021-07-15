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
import { Route } from "../../types";
import "leaflet/dist/leaflet.css";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  routeInfo: Route;
  setRouteInfo: React.Dispatch<React.SetStateAction<Route>>;
};

//URLのパラメータのinerface
interface RouteEditorParams {
  routeId: string;
}

function ClickLayer(props: ClickLayerProps): null {
  useMapEvent("click", async (e: LeafletMouseEvent) => {
    const res = await patchAdd(
      props.routeInfo.id,
      props.routeInfo.waypoints.length,
      {
        coord: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      }
    );
    if (res) {
      props.setRouteInfo({ ...props.routeInfo, ...res.data });
    }
  });
  return null;
}

const RouteEditor: FunctionComponent = () => {
  const { routeId } = useParams<RouteEditorParams>();
  const [routeInfo, setRouteInfo] = useState<Route>({
    id: routeId,
    name: "",
    waypoints: [],
    segments: [],
    elevation_gain: 0,
  });
  const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(false);

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    let unmounted = false;
    (async () => {
      const res = await getRoute(routeId);
      if (res && !unmounted) {
        setRouteInfo({ ...res.data });
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [routeId]);

  async function onClickClearHandler(): Promise<void> {
    const res = await patchClear(routeId);
    if (res) {
      setRouteInfo({ ...routeInfo, ...res.data });
    }
  }

  async function onClickUndoHandler(): Promise<void> {
    const res = await patchUndo(routeId);
    if (res) {
      setRouteInfo({ ...routeInfo, ...res.data });
    }
  }

  async function onClickRedoHandler(): Promise<void> {
    const res = await patchRedo(routeId);
    if (res) {
      setRouteInfo({ ...routeInfo, ...res.data });
    }
  }

  return (
    <>
      <Link to="/">ルート一覧へ</Link>
      <hr />
      <p>ルートid: {routeId}</p>

      <EditableNameDisplay routeInfo={routeInfo} setRouteInfo={setRouteInfo} />

      <p>獲得標高: {routeInfo.elevation_gain}m</p>
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
          routeInfo={routeInfo}
          setRouteInfo={setRouteInfo}
          setChangeCenterFlag={setChangeCenterFlag}
        />
        <Polylines routeInfo={routeInfo} setRouteInfo={setRouteInfo} />
        <ClickLayer routeInfo={routeInfo} setRouteInfo={setRouteInfo} />
      </MapContainer>
      {/* Todo undoできない時はボタンをdisabledにする */}
      <button onClick={onClickUndoHandler}>undo</button>
      {/* Todo redoできない時はボタンをdisabledにする */}
      <button onClick={onClickRedoHandler}>redo</button>
      <button onClick={onClickClearHandler}>clear</button>
    </>
  );
};

export default RouteEditor;
