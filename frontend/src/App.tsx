import React, { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import { Route, Routes } from 'react-router';
import Login from './features/users/Login';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUserAuthorized, selectUserToken } from './features/users/usersSlice';
import Register from './features/users/Register';
import { checkAuth } from './features/users/usersThunks';

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectUserToken);
  const authorized = useAppSelector(selectUserAuthorized);

  useEffect(() => {
    if (token) dispatch(checkAuth());
  }, [dispatch, token]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div>main path</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
