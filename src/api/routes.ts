import axios from "axios";
import { Route, RouteGeometry, Coorinate, DrawingMode } from "../types";
import {
  hasAxiosResponseMessage,
  generateAxiosHeaderWithBearer,
} from "./helpers";

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

type PostRouteResponseBody = {
  id: string;
};

type PostRouteRequest = {
  name: string;
  is_public: boolean;
};

export async function getRoute(routeId: string) {
  try {
    return await axios.get<RouteResponseBody>(`/routes/${routeId}`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function getRoutes() {
  try {
    return await axios.get<RoutesResponseBody>("/routes/");
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
    return await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/add/${idx}`,
      payload
    );
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
    return await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/remove/${pos}`,
      payload
    );
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchClear(routeId: string) {
  try {
    return await axios.patch<PatchResponseBody>(`/routes/${routeId}/clear/`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchUndo(routeId: string) {
  try {
    return await axios.patch<PatchResponseBody>(`/routes/${routeId}/undo/`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchRedo(routeId: string) {
  try {
    return await axios.patch<PatchResponseBody>(`/routes/${routeId}/redo/`);
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
    return await axios.patch<PatchResponseBody>(
      `/routes/${routeId}/move/${idx}`,
      payload
    );
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function patchRename(routeId: string, payload: RenameRequestBody) {
  try {
    return await axios.patch<RouteResponseBody>(
      `/routes/${routeId}/rename/`,
      payload
    );
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
}

export async function postRoute(token: string, payload: PostRouteRequest) {
  const { data } = await axios.post<PostRouteResponseBody>(
    "/routes/",
    payload,
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
