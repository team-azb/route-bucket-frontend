import axios from 'axios'
import { Position, Route } from '../types'

//axiosからのレスポンスのデータのインターフェース
interface PatchResponse{
    waypoints: Position[],
    linestring: Position[],
    message: string
}

interface RoutesResponse{
    routes: Route[]
}

interface RouteResponse extends Route{}

interface RouteRequestBody{
    coord: Position
}

export async function getRoute(routeId: string){
    let res;
    try {
        res = await axios.get<RouteResponse>(`/routes/${routeId}`);
    } catch (error) {
        console.error(error)
    }
    return res;
}

export async function getRoutes(){
    let res;
    try {
        res = await axios.get<RoutesResponse>('/routes/');
    } catch (error) {
        console.error(error)
    }
    return res;
}

export async function patchAdd(routeId: string, idx: number, payload: RouteRequestBody){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/add/${idx}`, payload);
        return res
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchDelete(routeId: string, pos: number){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/remove/${pos}`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res
}


export async function patchClear(routeId: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/clear/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchUndo(routeId: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/undo/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchRedo(routeId: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/redo/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchMove(routeId: string, idx: number, payload: RouteRequestBody){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${routeId}/move/${idx}`, payload);
        return res
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function postRoutes(name: string){
    try {
        await axios.post('/routes/', {
            'name': name
        })
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
}


export async function deleteRoute(id: string){
    try {
        await axios.delete(`/routes/${id}`)
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
}