import React from 'react';
import Layout from './components/Layout/Layout';
import { Route, Routes } from 'react-router';
import Login from './features/users/Login';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Register from './features/users/Register';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div>main path</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={!!user}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
