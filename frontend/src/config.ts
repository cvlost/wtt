import { Theme, ToastPosition } from 'react-toastify';

export const toastConfig = {
  position: 'bottom-right' as ToastPosition,
  autoClose: 4000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  theme: 'light' as Theme,
};

export const apiUrl = 'http://localhost:8000/api';
export const apiBaseUrl = 'http://localhost:8000/';
