import { useRef } from "react";
import { FocusedMarkerIcon } from "../EditableFocusedMarker/focusedMarkerIcon";
import { Marker } from "react-leaflet";
import { Marker as MarkerType } from "leaflet";
import { FocusedMarkerInfo } from "../../../types";

type FocusedMarkerProps = {
  zoomSize: number;
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FocusedMarker(props: FocusedMarkerProps) {
  const markerRef = useRef<MarkerType>(null);

  return (
    <>
      {props.focusedMarkerInfo.isDisplayed && (
        <Marker
          icon={FocusedMarkerIcon(props.zoomSize)}
          ref={markerRef}
          draggable={false}
          position={props.focusedMarkerInfo.position}
        />
      )}
    </>
  );
}
