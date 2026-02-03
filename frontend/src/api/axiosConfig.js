import axios from "axios";

const API = axios.create({
  // baseURL: "https://driver-hire.onrender.com/api",
  baseURL: " http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("dc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
