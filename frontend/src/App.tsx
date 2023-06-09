import React, { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import { Route, Routes } from 'react-router';
import Login from './features/users/Login';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUser, selectUserAuthorized, selectUserToken } from './features/users/usersSlice';
import Register from './features/users/Register';
import { checkAuth } from './features/users/usersThunks';
import Calendar from './features/calendar/Calendar';
import Day from './features/calendar/Day';
import Users from './features/users/Users';
import UserPage from './features/users/UserPage';
import Company from './pages/Company/Company';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectUserToken);
  const authorized = useAppSelector(selectUserAuthorized);
  const authorizedAdmin = authorized && user?.role === 'admin';

  useEffect(() => {
    if (token) dispatch(checkAuth());
  }, [dispatch, token]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={authorizedAdmin}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAllowed={authorizedAdmin}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id/edit"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <Register edit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar/:id"
          element={
            <ProtectedRoute isAllowed={authorized}>
              <Day />
            </ProtectedRoute>
          }
        />
        <Route path="/company" element={<Company />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
