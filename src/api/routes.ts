import axios, { AxiosResponse } from "axios";
import { Route, RouteGeometry, Coorinate, DrawingMode } from "../types";

//axiosからのレスポンスのデータのインターフェース
interface PatchResponseBody extends RouteGeometry {}

interface RoutesResponseBody {
  routes: Route[];
}

interface RouteResponseBody extends Route {}

interface RouteAddRequestBody {
  coord: Coorinate;
  mode: DrawingMode;
}

interface RouteMoveRequestBody extends RouteAddRequestBody {}

interface RouteRemoveRequestBody {
  mode: DrawingMode;
}

interface RenameRequestBody {
  name: string;
}

function hasAxiosResponseMessage(
  error: unknown
): error is { response: AxiosResponse<{ message: string }> } {
  return axios.isAxiosError(error) &&
    error.response &&
    error.response.data.message
    ? true
    : false;
}

export async function getRoute(routeId: string) {
  let res;
  try {
    res = await axios.get<RouteResponseBody>(`/routes/${routeId}`);
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
    res = await axios.get<RoutesResponseBody>("/routes/");
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
  payload: RouteAddRequestBody
) {
  let res;
  try {
    res = await axios.patch<PatchResponseBody>(
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
  payload: RouteRemoveRequestBody
) {
  let res;
  try {
    res = await axios.patch<PatchResponseBody>(
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
    res = await axios.patch<PatchResponseBody>(`/routes/${routeId}/clear/`);
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
    res = await axios.patch<PatchResponseBody>(`/routes/${routeId}/undo/`);
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
    res = await axios.patch<PatchResponseBody>(`/routes/${routeId}/redo/`);
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
  payload: RouteMoveRequestBody
) {
  let res;
  try {
    res = await axios.patch<PatchResponseBody>(
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

export async function patchRename(routeId: string, payload: RenameRequestBody) {
  try {
    let res = await axios.patch<RouteResponseBody>(
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
