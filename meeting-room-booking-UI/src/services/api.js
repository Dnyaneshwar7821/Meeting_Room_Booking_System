import axios from "axios";
import { showError } from "../utils/toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes("login");

    if (status === 401 && !isLoginRequest) {
      // Session expired or invalid token — log out and redirect
      localStorage.removeItem("user");
      window.location.replace("/");
    }

    if (status === 403) {
      showError("Access denied. You do not have permission to perform this action.");
    }

    return Promise.reject(error);
  },
);

export default API;
