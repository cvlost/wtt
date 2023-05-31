import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, isAxiosError } from 'axios';
import { apiUrl } from './config';
import { RootState } from './app/store';
import { Store } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const axiosApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl,
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = store.getState().users.accessToken;
    const headers = config.headers as AxiosHeaders;
    headers.set('Authorization', `Bearer ${token}`);

    return config;
  });

  axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isAxiosError(error)) {
        error = error as AxiosError;
        if (error.response.status > 401 && error.response.status < 500) {
          toast.error(error.response.data.error);
        } else if (error.response.status >= 500) {
          toast.error('Failed. Internal Server error.');
        }
        throw error;
      }
    },
  );
};

export default axiosApi;
