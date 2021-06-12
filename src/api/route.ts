import axios from 'axios'
import { Postion } from '../types/Position'

//axiosからのレスポンスのデータのインターフェース
interface Response{
    waypoints: Postion[],
    linestring: Postion[],
    message: string
}

export async function getRoute(route: string){
    let res;
    try {
        res = await axios.get(`/routes/${route}`);
    } catch (error) {
        console.error(error)
    }
    return res;
}

export async function patchAdd(latitude: number, longitude: number, position: number, route: string){
    const payload = {
        coord:{
            latitude: latitude,
            longitude: longitude
        }
    }
    let res;
    try {
        res = await axios.patch<Response>(`/routes/${route}/add/${position}`, payload);
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
        res = await axios.patch<Response>(`/routes/${route}/remove/${pos}`);
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
        res = await axios.patch<Response>(`/routes/${route}/clear/`);
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
        res = await axios.patch<Response>(`/routes/${route}/undo/`);
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
        res = await axios.patch<Response>(`/routes/${route}/redo/`);
    } catch (error) {
        if(error.response.data.message){
            console.error(error.response.data.message);
        }
    }
    return res;
}