export type Position = {
    latitude: number,
    longitude: number,
    evelation?: number,
}

export type RouteInfo = {
    id: string,
    name: string,
}

export type RouteGeometry = {
    waypoints: Position[],
    segments: Segment[],
    elevation_gain: number
}

export type Route = RouteInfo & RouteGeometry

export type Segment = {
    points: Position[],
    distance: number
}