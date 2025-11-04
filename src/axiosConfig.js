import axios from 'axios';
import { logout } from './redux/authSlice';

let store;

export const setStore = (reduxStore) => {
  store = reduxStore;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized, logging out:', error.response.data);
      store.dispatch(logout());
    }
    return Promise.reject(error.response?.data?.error || 'Request failed');
  }
);