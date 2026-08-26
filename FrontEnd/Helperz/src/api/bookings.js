import axiosInstance from "./axiosInstance";

export const getProviderBookings = async ()=>{
    const response = await axiosInstance.get('/bookings/getProviderBookings');
    return response.data;
}

export const getBookings = async () => {
  const response = await axiosInstance.get('/bookings/getBookings');
  return response.data;
};

export const getCustomerBookings = async (
    page = 1,
    limit = 5,
    type = 'upcoming'
) => {
    const response = await axiosInstance.get(
        `/bookings/getCustomerBookings?page=${page}&limit=${limit}&type=${type}`
    );

    return response.data;
};

export const createBooking = async (data)=>{
    const response = await axiosInstance.post('/bookings/createBooking',data);
    return response.data;
}
export const updateBookingStatus = async (id,status)=>{
    const response = await axiosInstance.put(`/bookings/${id}/status`,{status});
    return response.data;
}
export const cancelBooking = async (id)=>{
    const response = await axiosInstance.patch(`/bookings/${id}/cancelBooking`);
    return response.data;
}
