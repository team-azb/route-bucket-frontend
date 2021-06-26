export type Position = {
    latitude: number,
    longitude: number,
    evelation?: number,
}

export type Route = {
    id: string,
    name: string,
    waypoints?: Position[]
    linestring?: Position[]
    elevation_gain?: number
}