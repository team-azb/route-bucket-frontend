export const pagePaths = {
  top: () => "/",
  mypage: (userId?: string) => (userId ? `/${userId}` : "/:userId"),
  routeIndex: () => "/routes",
  routeNew: () => "/routes/new",
  routeEditor: (routeId?: string) =>
    routeId ? `/routes/${routeId}` : "/routes/:routeId",
  signIn: () => "/signin",
  signUp: () => "/signup",
  passwordReset: () => "/password_reset",
  startMarkerIcon: () => "/icons/start_pin.svg",
  markerIcon: () => "/icons/fmd_good_black_24dp.svg",
  goalMarkerIcon: () => "/icons/goal_pin.svg",
  focusedMarkerIcon: () => "/icons/circle_black_24dp.svg",
  userIcon: () => "/icons/account_circle.svg",
};

export const ORIGIN = "http://localhost:3000";
