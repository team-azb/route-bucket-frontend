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

const hasAxiosResponseMessage = (
  error: unknown
): error is { response: AxiosResponse<{ message: string }> } => {
  return axios.isAxiosError(error) &&
    error.response &&
    error.response.data.message
    ? true
    : false;
};

export const getRoute = async (routeId: string) => {
  try {
    const res = await axios.get<RouteResponseBody>(`/routes/${routeId}`);
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
};

export const getRoutes = async () => {
  try {
    const res = await axios.get<RoutesResponseBody>("/routes/");
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
};

export const patchAdd = async (
  routeId: string,
  idx: number,
  payload: RouteAddRequestBody
) => {
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
};

export const patchRemove = async (
  routeId: string,
  pos: number,
  payload: RouteRemoveRequestBody
) => {
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
};

export const patchClear = async (routeId: string) => {
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
};

export const patchUndo = async (routeId: string) => {
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
};

export const patchRedo = async (routeId: string) => {
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
};

export const patchMove = async (
  routeId: string,
  idx: number,
  payload: RouteMoveRequestBody
) => {
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
};

export const patchRename = async (
  routeId: string,
  payload: RenameRequestBody
) => {
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
};

export const postRoutes = async (name: string) => {
  try {
    await axios.post("/routes/", {
      name: name,
    });
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
};

export const deleteRoute = async (id: string) => {
  try {
    await axios.delete(`/routes/${id}`);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
};
