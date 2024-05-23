import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ROUTES } from '../routes';

const AuthGuard = ({ children }) => {
    const { state } = useContext(AuthContext);
    const location = useLocation();

    const allowedRoutes = [ROUTES.HOME.path, ROUTES.LOGIN.path, ROUTES.SIGNUP.path];

    if (!state.isAuthenticated && !allowedRoutes.includes(location.pathname)) {
        return <Navigate to={ROUTES.HOME.path} replace />;
    }

    return children;
};

export default AuthGuard;
