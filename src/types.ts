export type Position = {
    latitude: number,
    longitude: number,
    evelation?: number,
}

export type Route = {
    id: string,
    name: string,
    waypoints?: Position[]
    segments?: Segment[]
    elevation_gain?: number
}

export type Segment = {
    points: Position[],
    distance: number
}