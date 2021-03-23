import axios from '../../../services/axios';

export const setHeaderToken = (token) => {axios.defaults.headers.Authorization = `Bearer ${token}`; };
export const getHeaderToken = () => axios.defaults.headers.Authorization;
export const deleteHeaderToken = () => delete axios.defaults.headers.Authorization;

export const setLocalStorage = (payload) => {
  const data = { id: payload.id, token: payload.token };
  localStorage.setItem('user_dashboard', JSON.stringify(data));
};
export const getLocalStorage = () => JSON.parse(localStorage.getItem('user_dashboard'));
export const deleteLocalStorage = () => localStorage.removeItem('user_dashboard');
