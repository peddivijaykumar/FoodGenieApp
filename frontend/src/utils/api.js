//centeralized API setup

import axios from "axios";
import qs from "qs";

// If VITE_API_URL is not set, fall back to relative `/api` so Vite dev proxy works.
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api"
  : "/api";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default api;
