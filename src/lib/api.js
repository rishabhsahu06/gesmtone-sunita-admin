
import api from "./axiosInstanc"


// API functions
export const productAPI = {
  getAll: (token) => api.get("/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getById: (id, token) => api.get(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  create: (data, token) => api.post("/products", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  update: (id, data, token) => api.put(`/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  delete: (id, token) => api.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};
export const reelAPI = {
  getAll: (token) => api.get("/video", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getById: (id, token) => api.get(`/video/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  create: (data, token) => api.post("/video", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  delete: (id, token) => api.delete(`/video/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};

export const orderAPI = {
  // getAll: (token) => api.get("/orders/admin/all", {
// /api/orders?status=Processing&limit=1000')
// /api/orders?startDate=2024-01-01&endDate=2024-12-31&limit=1000')
// /api/orders?startDate=2024-01-01&endDate=2024-12-31&limit=1000')
// fetch('/api/orders?status=Processing&limit=1000')
  getAll: (token) => api.get("/orders?limit=100000", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getById: (id, token) => api.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  updateStatus: (id, status, token) => api.put(`/orders/${id}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
}

export const consultationAPI = {
  getAll: (token) => api.get("/booking-call", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getById: (id, token) => api.get(`/consultations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  updateStatus: (id, status, token) => api.put(`booking-call/${id}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  delete: (id, token) => api.delete(`/booking-call/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
}

export const analyticsAPI = {
  getSalesData: (token) => api.get("/orders/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getGrowthData: (token) => api.get("/analytics/growth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  getCategoryData: (token) => api.get("/analytics/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } ),
}

export default api
