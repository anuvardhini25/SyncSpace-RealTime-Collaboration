import api from './axiosInstance';

export const createRoom = async (name) => {
  const { data } = await api.post('/rooms', { name });
  return data;
};

export const joinRoomByCode = async (roomCode) => {
  const { data } = await api.post('/rooms/join', { roomCode });
  return data;
};

export const getMyRooms = async () => {
  const { data } = await api.get('/rooms');
  return data;
};

export const getRoomById = async (id) => {
  const { data } = await api.get(`/rooms/${id}`);
  return data;
};

export const getRoomReplay = async (id) => {
  const { data } = await api.get(`/rooms/${id}/replay`);
  return data;
};