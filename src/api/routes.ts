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

export async function getRoute(route: string){
    let res;
    try {
        res = await axios.get<RouteResponse>(`/routes/${route}`);
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

export async function patchAdd(latitude: number, longitude: number, index: number, route: string){
    const payload = {
        coord:{
            latitude: latitude,
            longitude: longitude
        }
    }
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/add/${index}`, payload);
        return res
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchDelete(route: string, pos: number){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/remove/${pos}`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res
}


export async function patchClear(route: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/clear/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchUndo(route: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/undo/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchRedo(route: string){
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/redo/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}

export async function patchMove(latitude: number, longitude: number, index: number, route: string){
    const payload = {
        coord:{
            latitude: latitude,
            longitude: longitude
        }
    }
    let res;
    try {
        res = await axios.patch<PatchResponse>(`/routes/${route}/move/${index}`, payload);
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