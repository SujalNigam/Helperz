import axiosInstance from "./axiosInstance";

export const getServices = async ()=>{
    const response = await axiosInstance.get('/services/getServices');
    return response.data;
}

export const createService = async (data)=>{
    const response = await axiosInstance.post('/services/createService',data);
    return response.data;
}

export const getServiceById = async (id) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data;
};

export const getProviderServices = async () => {
  const response = await axiosInstance.get('/services/getProviderServices');
  return response.data;
};


export const deleteService = async (id) => {
  const response = await axiosInstance.delete(`/services/deleteService/${id}`);
  return response.data;
};
export const editService = async (id,data) => {
  const response = await axiosInstance.put(`/services/editService/${id}`,data);
  return response.data;
};