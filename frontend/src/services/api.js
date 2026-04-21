import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("annquote_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("annquote_token");
      localStorage.removeItem("annquote_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const quotes = {
  list: (params) => api.get("/quotes/", { params }),
  get: (id) => api.get(`/quotes/${id}`),
  create: (data) => api.post("/quotes/", data),
  update: (id, data) => api.put(`/quotes/${id}`, data),
  delete: (id) => api.delete(`/quotes/${id}`),
  stats: () => api.get("/quotes/stats"),
};

export const clients = {
  list: () => api.get("/clients/"),
  create: (data) => api.post("/clients/", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};
