import axiosInstance from './axiosInstance';

export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const blockUnblockUser = async (id) => {
  const response = await axiosInstance.patch(`/users/${id}/block`);
  return response.data;
};