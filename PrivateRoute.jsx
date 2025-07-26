import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode'; // Named import
import { initializeAuth } from './src/redux/authSlice';
 // Adjusted path if in src/redux/

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData && !user) {
      const { token, email } = JSON.parse(authData);
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          dispatch(initializeAuth({ token, email }));
        } else {
          localStorage.removeItem('auth');
          dispatch(initializeAuth(null));
        }
      } catch (err) {
        localStorage.removeItem('auth');
        dispatch(initializeAuth(null));
      }
    } else if (!authData) {
      dispatch(initializeAuth(null));
    }
  }, [dispatch, user]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-black">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;