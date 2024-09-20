import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Route
      {...rest}
      element={
        isLoggedIn ? (
          <Component />
        ) : (
          <Navigate to={{ pathname: '/', state: { from: rest.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
