import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
});

// Add a request interceptor to attach the JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tickets
export const createTicket = (data) => API.post("/api/tickets", data);
export const getTickets = () => API.get("/api/tickets");
export const getTicketsByUser = (email) => API.get(`/api/tickets/user/${email}`);
export const assignTicket = (id, tech) =>
  API.put(`/api/tickets/${id}/assign?tech=${tech}`);

export const updateStatus = (id, status) =>
  API.put(`/api/tickets/${id}/status?status=${status}`);

export const resolveTicket = (id, note) =>
  API.put(`/api/tickets/${id}/resolve?note=${note}`);

// Admin
export const adminAssign = (id, tech) =>
  API.put(`/admin/assign?id=${id}&tech=${tech}`);

export const adminReject = (id, reason) =>
  API.put(`/admin/reject?id=${id}&reason=${reason}`);

// Comments
export const addComment = (data) =>
  API.post("/api/comments", data);

export const getComments = (ticketId) =>
  API.get(`/api/comments/ticket/${ticketId}`);

export const getUsersByRole = (role) => 
  API.get(`/api/users/role/${role}`);