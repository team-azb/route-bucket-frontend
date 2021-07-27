import { useState, useEffect, useRef, FunctionComponent } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvent, Marker } from "react-leaflet";
import L, { Marker as MarkerType, LeafletMouseEvent } from "leaflet";
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
import { Route, TempMarkerInfo } from "../../types";
import { TempMarkerIcon } from "./tempMarkerIcon";
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
      props.setRoute({ ...props.route, ...res.data });
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
  const markerRef = useRef<MarkerType>(null);
  const [zoomSize, setZoomSize] = useState<number>(13);
  const [tempMarkerInfo, setTempMarkerInfo] = useState<TempMarkerInfo>({
    position: null,
    index: null,
  });

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
      setRoute({ ...route, ...res.data });
    }
  }

  async function onClickUndoHandler(): Promise<void> {
    const res = await patchUndo(routeId);
    if (res) {
      setRoute({ ...route, ...res.data });
    }
  }

  async function onClickRedoHandler(): Promise<void> {
    const res = await patchRedo(routeId);
    if (res) {
      setRoute({ ...route, ...res.data });
    }
  }

  async function onClickMarker(latlng: L.LatLng, index: number) {
    const res = await patchAdd(route.id, index, {
      coord: {
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
    });
    if (res) {
      setRoute({ ...route, ...res.data });
    }
  }

  async function onDragMarker() {
    const newPoint = markerRef.current?.getLatLng();
    if (newPoint && tempMarkerInfo.index !== null) {
      const res = await patchAdd(route.id, tempMarkerInfo.index + 1, {
        coord: {
          latitude: newPoint.lat,
          longitude: newPoint.lng,
        },
      });
      if (res) {
        setRoute({ ...route, ...res.data });
        setTempMarkerInfo({ index: null, position: null });
      }
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
          tempMarkerInfo={tempMarkerInfo}
          setTempMarkerInfo={setTempMarkerInfo}
        />
        <Polylines
          setZoomSize={setZoomSize}
          tempMarkerInfo={tempMarkerInfo}
          setTempMarkerInfo={setTempMarkerInfo}
          route={route}
          setRoute={setRoute}
        />
        {tempMarkerInfo.position && (
          <Marker
            icon={TempMarkerIcon(zoomSize)}
            ref={markerRef}
            draggable={true}
            position={tempMarkerInfo.position}
            eventHandlers={{
              click: async (event: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(event); //clickLayerに対してクリックイベントを送らない
                tempMarkerInfo.index &&
                  onClickMarker(event.latlng, tempMarkerInfo.index + 1);
              },
              dragend: () => {
                onDragMarker();
              },
            }}
          />
        )}
        <ClickLayer route={route} setRoute={setRoute} />
      </MapContainer>
      {/* Todo undoできない時はボタンをdisabledにする */}
      <button onClick={onClickUndoHandler}>undo</button>
      {/* Todo redoできない時はボタンをdisabledにする */}
      <button onClick={onClickRedoHandler}>redo</button>
      <button onClick={onClickClearHandler}>clear</button>
      <ElevationGraph
        segments={route.segments}
        tempMarkerInfo={tempMarkerInfo}
        setTempMarkerInfo={setTempMarkerInfo}
      />
    </>
  );
};

export default RouteEditor;
