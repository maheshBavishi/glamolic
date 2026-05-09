import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to handle authorization
api.interceptors.request.use(
  (config) => {
    // If a token is provided in the request config, use it
    if (config.token) {
      config.headers.Authorization = `Bearer ${config.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
