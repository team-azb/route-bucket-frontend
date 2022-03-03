export const pagePaths = {
  top: () => "/",
  mypage: (userId?: string) => (userId ? `/${userId}` : "/:userId"),
  routeIndex: () => "/routes",
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

// export const dynamicPathGenerator = {
//   routeEditor: (routeId: string) => {
//     return `/routes/${routeId}`;
//   },
//   mypage: (userId: string) => {
//     return `/${userId}`;
//   },
// };

export const ORIGIN = "http://localhost:3000";
