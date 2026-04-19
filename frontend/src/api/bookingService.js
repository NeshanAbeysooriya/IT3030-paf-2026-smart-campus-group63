import axiosInstance from "./axiosInstance";

const BASE_PATH = "/api/bookings";

export const createBooking = (data) => axiosInstance.post(BASE_PATH, data);

export const getAllBookings = () => axiosInstance.get(BASE_PATH);


export const checkConflict = (resourceId, start, end) => {
    return axiosInstance.get(`${BASE_PATH}/check-conflicts`, {
        params: { resourceId, startTime: start, endTime: end }
    });
};

export const updateBookingStatus = (id, status, reason = "") => {
    return axiosInstance.patch(`${BASE_PATH}/${id}/status`, null, {
        params: {
            status: status.toUpperCase(),
            reason: reason
        }
    });
};

export const deleteBooking = (id) => axiosInstance.delete(`${BASE_PATH}/${id}`);

export const getUserBookings = (userId) => axiosInstance.get(`${BASE_PATH}/user/${userId}`);

export const cancelUserBooking = (id) => {
    return axiosInstance.put(`${BASE_PATH}/${id}/cancel`);
};