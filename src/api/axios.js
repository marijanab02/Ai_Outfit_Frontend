import axios from "axios";

// kreiramo axios instancu
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// interceptor za automatsko slanje tokena u svakom requestu
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
