import { api } from "./client";

export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: any) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
export const refreshToken = () => api.post("/auth/refresh-token");
