import { Reducer } from "react";
import { AsyncActionHandlers } from "use-reducer-async";
import { Route, RouteGeometry, RoutePoint, DrawingMode } from "../types";
import {
  getRoute,
  patchAdd,
  patchClear,
  patchDelete,
  patchMove,
  patchRedo,
  patchRename,
  patchUndo,
} from "../api/routes";

//TODO: typeをenumで指定できるようにしたい
export interface routeAsyncAction {
  type: string;
  id?: string;
  coord?: RoutePoint;
  mode?: DrawingMode;
  name?: string;
  targetIdx?: number;
}

export interface routeReducerAction {
  type: "UPDATE_ROUTE" | "UPDATE_ROUTE_GEOMETRY";
  newGeometry?: RouteGeometry;
  route?: Route;
}

export const routeReducer: Reducer<Route, routeReducerAction> = (
  route,
  action
) => {
  switch (action.type) {
    case "UPDATE_ROUTE":
      return { ...route, ...action.route };
    case "UPDATE_ROUTE_GEOMETRY":
      return { ...route, ...action.newGeometry };
    default:
      return route;
  }
};

export const routeAsyncActionHandlers: AsyncActionHandlers<
  Reducer<Route, routeReducerAction>,
  routeAsyncAction
> = {
  APPEND: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res =
        action.coord &&
        action.mode &&
        (await patchAdd(route.id, route.waypoints.length, {
          coord: action.coord,
          mode: action.mode,
        }));
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  INSERT: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res =
        action.targetIdx !== undefined &&
        action.coord &&
        action.mode &&
        (await patchAdd(route.id, action.targetIdx, {
          coord: action.coord,
          mode: action.mode,
        }));
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  GET: ({ dispatch }) => {
    return async (action) => {
      const res = action.id && (await getRoute(action.id));
      res &&
        dispatch({
          type: "UPDATE_ROUTE",
          route: { ...res.data, isLoaded: true },
        });
    };
  },
  CLEAR: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchClear(route.id);
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  UNDO: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchUndo(route.id);
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  REDO: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchRedo(route.id);
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  RENAME: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res =
        action.name && (await patchRename(route.id, { name: action.name }));
      res && dispatch({ type: "UPDATE_ROUTE", route: res.data });
    };
  },
  MOVE: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res =
        action.targetIdx !== undefined &&
        action.coord &&
        action.mode &&
        (await patchMove(route.id, action.targetIdx, {
          coord: action.coord,
          mode: action.mode,
        }));
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
  DELETE: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res =
        action.targetIdx !== undefined &&
        (await patchDelete(route.id, action.targetIdx));
      res &&
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
    };
  },
};
