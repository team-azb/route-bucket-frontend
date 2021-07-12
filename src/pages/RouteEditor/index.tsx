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
import { Position, Segment } from "../../types";
import Markers from "../../components/Markers";
import Polylines from "../../components/Polylines";
import EditableNameDisplay from "../../components/EditableNameDisplay";
import "leaflet/dist/leaflet.css";

//ClickLayerコンポーネントのpropsの型
type ClickLayerProps = {
  waypoints: Position[];
  route: string;
  setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>;
  setSegments: React.Dispatch<React.SetStateAction<Segment[]>>;
};

//URLのパラメータのinerface
interface RouteEditorParams {
  routeId: string;
}

function ClickLayer(props: ClickLayerProps): null {
  useMapEvent("click", async (e: LeafletMouseEvent) => {
    const res = await patchAdd(props.route, props.waypoints.length, {
      coord: {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    });
    if (res) {
      props.setWaypoints(res.data.waypoints);
      props.setSegments(res.data.segments);
    }
  });
  return null;
}

const RouteEditor: FunctionComponent = () => {
  const [waypoints, setWaypoints] = useState<Position[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [routeName, setRouteName] = useState<string>("");
  const [elevationGain, setElevationGain] = useState<number>(0);
  const [changeCenterFlag, setChangeCenterFlag] = useState<boolean>(false);
  const { routeId } = useParams<RouteEditorParams>();

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    let unmounted = false;
    (async () => {
      const res = await getRoute(routeId);
      if (res && !unmounted) {
        if (res.data.waypoints) {
          setWaypoints(res.data.waypoints);
        }
        if (res.data.segments) {
          setSegments(res.data.segments);
        }
        setElevationGain(res.data.elevation_gain || 0);
        setRouteName(res.data.name);
        setChangeCenterFlag(true);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [routeId]);

  async function onClickClearHandler(): Promise<void> {
    const res = await patchClear(routeId);
    if (res) {
      setWaypoints(res.data.waypoints);
      setSegments(res.data.segments);
      setElevationGain(res.data.elevation_gain || 0);
    }
  }

  async function onClickUndoHandler(): Promise<void> {
    const res = await patchUndo(routeId);
    if (res) {
      setWaypoints(res.data.waypoints);
      setSegments(res.data.segments);
      setElevationGain(res.data.elevation_gain || 0);
    }
  }

  async function onClickRedoHandler(): Promise<void> {
    const res = await patchRedo(routeId);
    if (res) {
      setWaypoints(res.data.waypoints);
      setSegments(res.data.segments);
      setElevationGain(res.data.elevation_gain || 0);
    }
  }

  return (
    <>
      <Link to="/">ルート一覧へ</Link>
      <hr />
      <p>ルートid: {routeId}</p>

      <EditableNameDisplay
        routeId={routeId}
        setRouteName={setRouteName}
        routeName={routeName}
      />

      <p>獲得標高: {elevationGain}m</p>
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
          waypoints={waypoints}
          route={routeId}
          changeCenterFlag={changeCenterFlag}
          setChangeCenterFlag={setChangeCenterFlag}
          setWaypoints={setWaypoints}
          setSegments={setSegments}
          setElevationGain={setElevationGain}
        />
        <Polylines
          segments={segments}
          route={routeId}
          setWaypoints={setWaypoints}
          setSegments={setSegments}
          setElevationGain={setElevationGain}
        />
        <ClickLayer
          route={routeId}
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          setSegments={setSegments}
        />
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
