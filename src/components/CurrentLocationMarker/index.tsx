import { useState } from "react";
import { LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";
import { CurrentLocationMarkerIcon } from "./currentLocationMarkerIcon";

type CurrentLacationMarkerProps = {
  zoomSize: number;
};

export default function CurrentLacationMarker(
  props: CurrentLacationMarkerProps
) {
  const [currentLocation, setCurrentLocation] = useState<LatLngExpression>();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }
  return (
    <>
      {currentLocation && (
        <Marker
          icon={CurrentLocationMarkerIcon(props.zoomSize)}
          position={currentLocation}
        />
      )}
    </>
  );
}
