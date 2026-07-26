import axiosInstance from './axiosInstance';

export const loginUser = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/getMe');
  return response.data;
};

export const editProfile = async (data) => {
  const response = await axiosInstance.patch('/auth/editProfile',data);
  return response.data;
};