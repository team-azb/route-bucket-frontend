import axios from "axios";
import { Route, RouteGeometry, Coorinate, DrawingMode } from "../types";

//axiosからのレスポンスのデータのインターフェース
interface PatchResponse extends RouteGeometry {}

interface RoutesResponse {
  routes: Route[];
}

interface RouteResponse extends Route {}

interface RouteAddRequest {
  coord: Coorinate;
  mode: DrawingMode;
}

interface RouteMoveRequest extends RouteAddRequest {}

interface RouteRemoveRequest {
  mode: DrawingMode;
}

interface RenameRequest {
  name: string;
}

function hasAxiosResponseMessage(
  error: unknown
): error is { response: { data: { message: string } } } {
  return axios.isAxiosError(error) &&
    error.response &&
    error.response.data.message
    ? true
    : false;
}

export async function getRoute(routeId: string) {
  let res;
  try {
    res = await axios.get<RouteResponse>(`/routes/${routeId}`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function getRoutes() {
  let res;
  try {
    res = await axios.get<RoutesResponse>("/routes/");
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchAdd(
  routeId: string,
  idx: number,
  payload: RouteAddRequest
) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(
      `/routes/${routeId}/add/${idx}`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchRemove(
  routeId: string,
  pos: number,
  payload: RouteRemoveRequest
) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(
      `/routes/${routeId}/remove/${pos}`,
      payload
    );
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchClear(routeId: string) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(`/routes/${routeId}/clear/`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchUndo(routeId: string) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(`/routes/${routeId}/undo/`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchRedo(routeId: string) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(`/routes/${routeId}/redo/`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchMove(
  routeId: string,
  idx: number,
  payload: RouteMoveRequest
) {
  let res;
  try {
    res = await axios.patch<PatchResponse>(
      `/routes/${routeId}/move/${idx}`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
}

export async function patchRename(routeId: string, payload: RenameRequest) {
  try {
    let res = await axios.patch<RouteResponse>(
      `/routes/${routeId}/rename/`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function postRoutes(name: string) {
  try {
    await axios.post("/routes/", {
      name: name,
    });
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function deleteRoute(id: string) {
  try {
    await axios.delete(`/routes/${id}`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}
