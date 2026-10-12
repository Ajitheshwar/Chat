import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const getErrorMessage = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || "An unknown error occurred";
};

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshPromise: Promise<any> | null = null;
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const excludedPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh-token",
    ];
    const isExcludedPath = excludedPaths.some((path) =>
      originalRequest.url?.includes(path),
    );
    if (
      error.response &&
      (error.response.status !== 401 ||
        !isExcludedPath ||
        originalRequest._retry)
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh-token");
      }
      await refreshPromise;
      refreshPromise = null;
      return api(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  },
);
