import { useEffect, FunctionComponent, useRef, createRef, RefObject } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { Marker as MarkerType } from 'leaflet';
import { nanoid } from 'nanoid';
import { patchDelete, patchMove } from '../../api/routes'
import { Position } from '../../types'

type MakersProps = {
    waypoints: Position[],
    route: string,
    changeCenterFlag: boolean,
    setChangeCenterFlag: React.Dispatch<React.SetStateAction<boolean>>,
    setWaypoints: React.Dispatch<React.SetStateAction<Position[]>>,
    setLinestring: React.Dispatch<React.SetStateAction<Position[]>>
}

export const Markers: FunctionComponent<MakersProps> = (props: MakersProps) => {
    const map = useMap()
    const markerRefs = useRef<Array<RefObject<MarkerType>>>(Array(props.waypoints.length))
    useEffect(() => {
        if(props.changeCenterFlag){
            if(props.waypoints.length){
                map.setView([props.waypoints[0].latitude, props.waypoints[0].longitude])
            }
            props.setChangeCenterFlag(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.changeCenterFlag]);
    const markers = props.waypoints.map((pos: Position, idx: number): JSX.Element => {
        markerRefs.current[idx] = createRef<MarkerType>()
        async function onClickMarker(idx: number){
            const res = await patchDelete(props.route, idx);
            if(res){
                props.setWaypoints(res.data.waypoints);
                props.setLinestring(res.data.linestring);
            }
        }

        async function onDragMarker(idx: number){
            const newPoint = markerRefs.current[idx].current?.getLatLng()      
            if(newPoint){   
                const res = await patchMove(newPoint.lat, newPoint.lng, idx, props.route)
                if(res){
                    props.setWaypoints(res.data.waypoints);
                    props.setLinestring(res.data.linestring);
                }
            }
        }

        return (
            <Marker
                ref={markerRefs.current[idx]}
                draggable={true}
                position={[pos.latitude, pos.longitude]}
                key={nanoid()}
                eventHandlers={{
                    click: ()=>{
                        onClickMarker(idx)
                    },
                    dragend: () => {
                        onDragMarker(idx)
                    }
                }} //todo: ここの関数を一つにまとめたい
            >
            </Marker>
        )
    })
    return(
        <>
        {markers}
        </>
    )
}