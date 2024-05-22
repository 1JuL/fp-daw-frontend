import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ROUTES } from '../routes';

const AuthGuard = ({ children }) => {
    const { state } = useContext(AuthContext);

    if (!state.isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN.path} replace />;
    }

    return children;
};

export default AuthGuard;