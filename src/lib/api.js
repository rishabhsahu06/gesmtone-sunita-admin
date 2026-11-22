import api from "./axiosInstanc";

const authHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

const DEFAULT_LIST_LIMIT = 200;

export const productAPI = {
  getAll: (token, params = {}) =>
    api.get("/products", {
      headers: authHeaders(token),
      params: {
        limit: DEFAULT_LIST_LIMIT,
        ...params,
      },
    }),
  getById: (id, token) =>
    api.get(`/products/${id}`, {
      headers: authHeaders(token),
    }),
  create: (data, token) =>
    api.post("/products", data, {
      headers: authHeaders(token),
    }),
  update: (id, data, token) =>
    api.put(`/products/${id}`, data, {
      headers: authHeaders(token),
    }),
  delete: (id, token) =>
    api.delete(`/products/${id}`, {
      headers: authHeaders(token),
    }),
};

export const reelAPI = {
  getAll: (token) =>
    api.get("/video", {
      headers: authHeaders(token),
    }),
  getById: (id, token) =>
    api.get(`/video/${id}`, {
      headers: authHeaders(token),
    }),
  create: (data, token) =>
    api.post("/video", data, {
      headers: authHeaders(token),
    }),
  delete: (id, token) =>
    api.delete(`/video/${id}`, {
      headers: authHeaders(token),
    }),
};

export const orderAPI = {
  getAll: (token, params = {}) =>
    api.get("/orders", {
      headers: authHeaders(token),
      params: {
        limit: DEFAULT_LIST_LIMIT,
        ...params,
      },
    }),
  getById: (id, token) =>
    api.get(`/orders/${id}`, {
      headers: authHeaders(token),
    }),
  updateStatus: (id, status, token) =>
    api.put(
      `/orders/${id}`,
      { status },
      {
        headers: authHeaders(token),
      }
    ),
};

export const consultationAPI = {
  getAll: (token, params = {}) =>
    api.get("/booking-call", {
      headers: authHeaders(token),
      params,
    }),
  getById: (id, token) =>
    api.get(`/consultations/${id}`, {
      headers: authHeaders(token),
    }),
  updateStatus: (id, status, token) =>
    api.put(
      `/booking-call/${id}`,
      { status },
      {
        headers: authHeaders(token),
      }
    ),
  delete: (id, token) =>
    api.delete(`/booking-call/${id}`, {
      headers: authHeaders(token),
    }),
};

export const analyticsAPI = {
  getSalesData: (token) =>
    api.get("/orders/admin/stats", {
      headers: authHeaders(token),
    }),
  getGrowthData: (token) =>
    api.get("/analytics/growth", {
      headers: authHeaders(token),
    }),
  getCategoryData: (token) =>
    api.get("/analytics/categories", {
      headers: authHeaders(token),
    }),
};

export default api;
