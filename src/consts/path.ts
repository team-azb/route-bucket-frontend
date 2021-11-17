export const pagePaths = {
  TOP: "/",
  ROUTE_INDEX: "/routes",
  ROUTE_EDITOR: "/routes/:routeId",
  SIGN_IN: "/signin",
  PASSWORD_RESET: "/password_reset",
  routeEditorPath: (routeId: string) => {
    return `/routes/${routeId}`;
  },
};

export const staticFileUrls = {
  START_MARKER_ICON: "http://localhost:3000/icons/start_pin.svg",
  MARKER_ICON: "http://localhost:3000/icons/fmd_good_black_24dp.svg",
  GOAL_MARKER_ICON: "http://localhost:3000/icons/goal_pin.svg",
};
