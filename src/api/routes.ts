import axios, { AxiosResponse } from "axios";
import { Route, RouteGeometry, Coorinate, DrawingMode } from "../types";

//axiosからのレスポンスのデータのインターフェース
type PatchResponseBody = RouteGeometry;

interface RoutesResponseBody {
  routes: Route[];
}

type RouteResponseBody = Route;

interface RouteAddRequestBody {
  coord: Coorinate;
  mode: DrawingMode;
}

type RouteMoveRequestBody = RouteAddRequestBody;

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
  try {
    const res = await axios.get<RouteResponseBody>(`/routes/${routeId}`);
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function getRoutes() {
  try {
    const res = await axios.get<RoutesResponseBody>("/routes/");
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchAdd(
  routeId: string,
  idx: number,
  payload: RouteAddRequestBody
) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/add/${idx}`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchRemove(
  routeId: string,
  pos: number,
  payload: RouteRemoveRequestBody
) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/remove/${pos}`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchClear(routeId: string) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/clear/`
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchUndo(routeId: string) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/undo/`
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchRedo(routeId: string) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/redo/`
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchMove(
  routeId: string,
  idx: number,
  payload: RouteMoveRequestBody
) {
  try {
    const res = await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/move/${idx}`,
      payload
    );
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchRename(routeId: string, payload: RenameRequestBody) {
  try {
    const res = await axios.patch<RouteResponseBody>(
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
