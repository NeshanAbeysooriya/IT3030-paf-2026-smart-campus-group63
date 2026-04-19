import axiosInstance from "./axiosInstance";

const BASE_PATH = "/api/bookings";

// Requirement: Create a booking (Standard POST) [cite: 226]
export const createBooking = (data) => axiosInstance.post(BASE_PATH, data);

// Requirement: Admin can view all bookings (Standard GET) [cite: 194]
export const getAllBookings = () => axiosInstance.get(BASE_PATH);

/**
 * Requirement: Admin status update (Workflow: PENDING -> APPROVED/REJECTED) [cite: 191]
 * FIX: This structure ensures @RequestParam in Spring Boot receives the data.
 */
export const updateBookingStatus = (id, status, reason = "") => {
    return axiosInstance.patch(`${BASE_PATH}/${id}/status`, null, {
        params: {
            status: status.toUpperCase(),
            reason: reason
        }
    });
};

// Requirement: Delete booking (Standard DELETE) [cite: 226]
export const deleteBooking = (id) => axiosInstance.delete(`${BASE_PATH}/${id}`);

// Requirement: Users can view their own bookings [cite: 194]
export const getUserBookings = (userId) => axiosInstance.get(`${BASE_PATH}/user/${userId}`);

export const cancelUserBooking = (id) => {
    return axiosInstance.put(`${BASE_PATH}/${id}/cancel`);
};