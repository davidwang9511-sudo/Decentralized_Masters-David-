import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" }
});