import { Reducer } from "react";
import { AsyncActionHandlers } from "use-reducer-async";
import { Route, RouteGeometry, RoutePoint, DrawingMode } from "../types";
import {
  getRoute,
  patchAdd,
  patchClear,
  patchRemove,
  patchMove,
  patchRedo,
  patchRename,
  patchUndo,
} from "../api/routes";

export type routeAsyncAction =
  | {
      type: "APPEND";
      coord: RoutePoint;
      mode: DrawingMode;
    }
  | {
      type: "INSERT";
      targetIdx: number;
      coord: RoutePoint;
      mode: DrawingMode;
    }
  | {
      type: "GET";
      id: string;
    }
  | {
      type: "CLEAR";
    }
  | {
      type: "UNDO";
    }
  | {
      type: "REDO";
    }
  | {
      type: "RENAME";
      name: string;
    }
  | {
      type: "MOVE";
      targetIdx: number;
      coord: RoutePoint;
      mode: DrawingMode;
    }
  | {
      type: "REMOVE";
      targetIdx: number;
      mode: DrawingMode;
    };

export type routeReducerAction =
  | {
      type: "UPDATE_ROUTE";
      route: Route;
    }
  | {
      type: "UPDATE_ROUTE_GEOMETRY";
      newGeometry?: RouteGeometry;
    }
  | {
      type: "ERROR";
      errorMsg: string;
    };

export const routeReducer: Reducer<
  Route & { error?: Error },
  routeReducerAction
> = (route, action) => {
  switch (action.type) {
    case "UPDATE_ROUTE":
      return { ...route, ...action.route, error: undefined };
    case "UPDATE_ROUTE_GEOMETRY":
      return { ...route, ...action.newGeometry, error: undefined };
    case "ERROR":
      return { ...route, error: new Error(action.errorMsg) };
    default:
      return route;
  }
};

export const routeAsyncActionHandlers: AsyncActionHandlers<
  Reducer<Route & { error?: Error }, routeReducerAction>,
  routeAsyncAction
> = {
  APPEND: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchAdd(route.id, route.waypoints.length, {
        coord: action.coord,
        mode: action.mode,
      });
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "地点の追加に失敗しました。",
        });
      }
    };
  },
  INSERT: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchAdd(route.id, action.targetIdx, {
        coord: action.coord,
        mode: action.mode,
      });
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "地点の挿入に失敗しました。",
        });
      }
    };
  },
  GET: ({ dispatch }) => {
    return async (action) => {
      const res = await getRoute(action.id);
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE",
          route: { ...res.data, isLoaded: true },
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "ルートの取得に失敗しました。",
        });
      }
    };
  },
  CLEAR: ({ dispatch, getState }) => {
    return async () => {
      const route = getState();
      const res = await patchClear(route.id);
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "ルートのクリアに失敗しました。",
        });
      }
    };
  },
  UNDO: ({ dispatch, getState }) => {
    return async () => {
      const route = getState();
      const res = await patchUndo(route.id);
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "操作の取り消しに失敗しました。",
        });
      }
    };
  },
  REDO: ({ dispatch, getState }) => {
    return async () => {
      const route = getState();
      const res = await patchRedo(route.id);
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "操作のやり直しに失敗しました。",
        });
      }
    };
  },
  RENAME: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchRename(route.id, { name: action.name });
      if (res) {
        dispatch({ type: "UPDATE_ROUTE", route: res.data });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "ルート名の変更に失敗しました。",
        });
      }
    };
  },
  MOVE: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchMove(route.id, action.targetIdx, {
        coord: action.coord,
        mode: action.mode,
      });
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "地点の変更に失敗しました。",
        });
      }
    };
  },
  REMOVE: ({ dispatch, getState }) => {
    return async (action) => {
      const route = getState();
      const res = await patchRemove(route.id, action.targetIdx, {
        mode: action.mode,
      });
      if (res) {
        dispatch({
          type: "UPDATE_ROUTE_GEOMETRY",
          newGeometry: res.data,
        });
      } else {
        dispatch({
          type: "ERROR",
          errorMsg: "地点の削除に失敗しました。",
        });
      }
    };
  },
};
