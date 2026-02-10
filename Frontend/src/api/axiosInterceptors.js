import api from "./Axios";
import store from "../store/store";
import { logout } from "../store/reducers/userReducer";
import toast from "react-hot-toast";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // ======== GENERIC TOAST HANDLING FOR COMMON STATUSES ========
    if (status === 400 || status === 409) {
      // Validation / business errors (e.g. user already exists)
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null);

      if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Something went wrong. Please check your input and try again.");
      }
    } else if (status === 429) {
      // Too Many Requests (rate limiting)
      const rateMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Too many requests. Please wait a moment and try again.";

      toast.error(rateMessage, {
        icon: "⏱️",
      });
    } else if (status === 500 || status === 503) {
      toast.error("Server error occurred. Please try again later.");
    } else if (!error.response) {
      // Network / CORS / unreachable backend
      toast.error("Network error. Please check your connection and try again.");
    }

    // ======== AUTH-SPECIFIC HANDLING (401) ========
    if (status === 401) {
      // Don't logout if the request was to auth endpoints themselves
      if (url.includes("/signout") || url.includes("/signin") || url.includes("/register")) {
        return Promise.reject(error);
      }

      // Only logout on explicit user fetch
      if (url.includes("/api/auth/user") || url.includes("/auth/user")) {
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          store.dispatch(logout());
          toast.error("Your session has expired. Please login again.");
        }
      }
      // For other 401s, just let the component handle it
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
