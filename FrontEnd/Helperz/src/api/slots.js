import axiosInstance from "./axiosInstance";

export const getAvailableSlots = async (serviceId, date) => {
    let url = `/slots/${serviceId}`;
    if (date) {
        url += `?date=${date}`;
    }
    const response = await axiosInstance.get(url);

    return response.data;
}

export const getProviderSlots = async (serviceId) => {
    const response = await axiosInstance.get(
        `/slots/provider/${serviceId}/manage`
    );

    return response.data;
};

export const generateSlots = async (serviceId, data) => {
    const response = await axiosInstance.post(
        `/slots/${serviceId}/generate`,
        data
    );

    return response.data;
};

export const updateSlotStatus = async (slotId, status) => {
    const response = await axiosInstance.put(
        `/slots/provider/${slotId}/status`,
        { status }
    );

    return response.data;
};