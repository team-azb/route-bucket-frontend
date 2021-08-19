export type Position = {
  latitude: number;
  longitude: number;
  elevation?: number;
  distance_from_start?: number;
};

export type RouteInfo = {
  id: string;
  name: string;
};

export type RouteGeometry = {
  waypoints: Position[];
  segments: Segment[];
  elevation_gain?: number;
};

export type Route = RouteInfo & RouteGeometry;

export type Segment = {
  points: Position[];
};

export type FocusedMarkerInfo = {
  position: L.LatLng;
  idx: number;
  isDisplayed: boolean;
};
