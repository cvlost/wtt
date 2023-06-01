import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { addInterceptors } from './axiosApi';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import DialogsProvider from './components/Dialogs/DialogsProvider';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <DialogsProvider>
            <App />
          </DialogsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
