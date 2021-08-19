import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  useMap,
  useMapEvent,
  Rectangle,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { useEventHandlers } from "@react-leaflet/core";
import L, { Map } from "leaflet";

type MinimapProps = {
  zoom: number;
};

type MinimapBoundsProps = {
  parentMap: Map;
  zoom: number;
};

const BOUNDS_STYLE = { weight: 1 };

function MinimapBounds({ parentMap, zoom }: MinimapBoundsProps) {
  const minimap = useMap();
  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom());
    },
    [parentMap]
  );
  useMapEvent("click", onClick);
  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds());
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds());
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom);
  }, [minimap, parentMap, zoom]);

  // Listen to events on the parent map
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), []);
  const context = {
    __version: 0,
    map: parentMap,
  };
  useEventHandlers({ instance: parentMap, context: context }, handlers);

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />;
}

export default function Minimap({ zoom }: MinimapProps) {
  const parentMap = useMap();
  const mapZoom = zoom || 0;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
      L.DomEvent.disableScrollPropagation(divRef.current);
    }
  });

  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div ref={divRef} className={"leaflet-top leaflet-right"}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  );
}
