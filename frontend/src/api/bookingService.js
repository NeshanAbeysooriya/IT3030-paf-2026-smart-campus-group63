import axiosInstance from "./axiosInstance";

const BASE_PATH = "/api/bookings";

export const createBooking = (data) => axiosInstance.post(BASE_PATH, data);
export const getAllBookings = () => axiosInstance.get(BASE_PATH);
export const updateBookingStatus = (id, status, reason = "") => 
    axiosInstance.patch(`${BASE_PATH}/${id}/status?status=${status}&reason=${reason}`);
export const deleteBooking = (id) => axiosInstance.delete(`${BASE_PATH}/${id}`);
export const getUserBookings = (userId) => axiosInstance.get(`${BASE_PATH}/user/${userId}`);