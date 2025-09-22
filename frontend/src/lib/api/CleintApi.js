import axios from "axios";
import store from "../Reduxs/store";


// ✅ Base API URL
const Api_URL = process.env.NODE_ENV === "production" ?"https://realstate-fullstack-project.onrender.com/api":"http://localhost:4800/api"

const api = axios.create({
  baseURL: Api_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



// ✅ Attach token on requests
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
