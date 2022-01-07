import axios from "axios";
import { Route, RouteGeometry, Coorinate, DrawingMode } from "../types";
import {
  hasAxiosResponseMessage,
  generateAxiosHeaderWithBearer,
} from "./helpers";

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

type PostRouteResponseBody = {
  id: string;
};

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

export async function postRoute(name: string, token: string) {
  const { data } = await axios.post<PostRouteResponseBody>(
    "/routes/",
    {
      name: name,
    },
    generateAxiosHeaderWithBearer(token)
  );
  return data;
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
