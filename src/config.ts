export const config = {
  BACKEND_ORIGIN:
    process.env.NODE_ENV === "production" ? "" : "http://localhost:8080",
};
