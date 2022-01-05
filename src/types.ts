export type RoutePoint = Coorinate & {
  elevation?: number;
  distance_from_start?: number;
};

export type Coorinate = {
  latitude: number;
  longitude: number;
};

export type RouteInfo = {
  id: string;
  name: string;
  isLoaded: boolean;
  bounding_box?: BoundingBox;
};

export type RouteGeometry = {
  waypoints: RoutePoint[];
  segments: Segment[];
  elevation_gain: number;
  total_distance: number;
};

export type Route = RouteInfo & RouteGeometry & { error?: Error };

export type Segment = {
  points: RoutePoint[];
};

export type BoundingBox = {
  max_coord: Coorinate;
  min_coord: Coorinate;
};

export type FocusedMarkerInfo = {
  position: L.LatLng;
  idx: number;
  isDisplayed: boolean;
};

export enum DrawingMode {
  FOLLOW_ROAD = "follow_road",
  FREEHAND = "freehand",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHERS = "others",
}

export type UserInfo = {
  id: string;
  name: string;
  gender?: Gender;
  birthdate?: string;
  icon_url?: string;
};
