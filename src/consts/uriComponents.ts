export const pagePaths = {
  TOP: "/",
  ROUTE_INDEX: "/routes",
  ROUTE_EDITOR: "/routes/:routeId",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  PASSWORD_RESET: "/password_reset",
  routeEditorPath: (routeId: string) => {
    return `/routes/${routeId}`;
  },
  START_MARKER_ICON: "/icons/start_pin.svg",
  MARKER_ICON: "/icons/fmd_good_black_24dp.svg",
  GOAL_MARKER_ICON: "/icons/goal_pin.svg",
  FOCUSED_MARKER_ICON: "/icons/circle_black_24dp.svg",
};

export const ORIGIN = "http://localhost:3000";
