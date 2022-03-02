import { Marker } from "react-leaflet";
import { nanoid } from "nanoid";
import { Route, FocusedMarkerInfo } from "../../../types";
import { GoalMarkerIcon, StartMarkerIcon } from "../EditableMarkers/markerIcon";

type MakersProps = {
  route: Route;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Markers(props: MakersProps) {
  return (
    <>
      {props.route.waypoints.length && (
        <Marker
          icon={StartMarkerIcon}
          zIndexOffset={50}
          draggable={false}
          position={[
            props.route.waypoints[0].latitude,
            props.route.waypoints[0].longitude,
          ]}
          key={nanoid()}
        />
      )}
      {props.route.waypoints.length > 1 && (
        <Marker
          icon={GoalMarkerIcon}
          zIndexOffset={50}
          draggable={false}
          position={[
            props.route.waypoints[props.route.waypoints.length - 1].latitude,
            props.route.waypoints[props.route.waypoints.length - 1].longitude,
          ]}
          key={nanoid()}
        />
      )}
    </>
  );
}
