import api from './axiosInstance';

export const signupUser = async (payload) => {
  const { data } = await api.post('/auth/signup', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};