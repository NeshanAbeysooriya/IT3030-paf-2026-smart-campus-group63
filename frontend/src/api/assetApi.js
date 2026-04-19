import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";

const BASE_PATH = "/api/resources";

export const getAllAssets = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get(BASE_PATH, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch assets";
        toast.error(msg);
        throw error;
    }
};

export const getAsset = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch asset";
        toast.error(msg);
        throw error;
    }
};

export const searchAssets = async (params = {}) => {
    try {
        const response = await axiosInstance.get(`${BASE_PATH}/search`, { params });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to search assets";
        toast.error(msg);
        throw error;
    }
};

export const getAvailableAssets = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get(`${BASE_PATH}/available`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch available assets";
        toast.error(msg);
        throw error;
    }
};

export const createAsset = async (assetData) => {
    try {
        const response = await axiosInstance.post(BASE_PATH, assetData);
        toast.success("Asset created successfully!");
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to create asset";
        toast.error(msg);
        throw error;
    }
};

export const updateAsset = async (id, assetData) => {
    try {
        const response = await axiosInstance.put(`${BASE_PATH}/${id}`, assetData);
        toast.success("Asset updated successfully!");
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to update asset";
        toast.error(msg);
        throw error;
    }
};

export const deleteAsset = async (id) => {
    try {
        await axiosInstance.delete(`${BASE_PATH}/${id}`);
        toast.success("Asset deleted successfully!");
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete asset";
        toast.error(msg);
        throw error;
    }
};

export const updateAssetStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`${BASE_PATH}/${id}/status`, null, {
            params: { newStatus }
        });
        toast.success("Asset status updated successfully!");
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to update asset status";
        toast.error(msg);
        throw error;
    }
};

export const getAdminStats = async () => {
    try {
        const response = await axiosInstance.get("/api/admin/resources/stats");
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch admin stats";
        toast.error(msg);
        throw error;
    }
};

export const checkAssetAvailability = async (id, startTime, endTime) => {
    try {
        const response = await axiosInstance.get(`${BASE_PATH}/${id}/check-availability`, {
            params: { startTime, endTime }
        });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to check availability";
        toast.error(msg);
        throw error;
    }
};

export const getAssetBookings = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/bookings/resource/${id}`);
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch asset bookings";
        toast.error(msg);
        throw error;
    }
};