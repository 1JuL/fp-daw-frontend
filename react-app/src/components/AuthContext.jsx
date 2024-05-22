import React, { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

// Reducer para gestionar el estado de autenticación
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isAuthenticated: true, token: action.payload };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, token: null };
        default:
            return state;
    }
};

// Crear el contexto
const AuthContext = createContext();

// Función para verificar si el token es válido
const isTokenValid = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp > currentTime) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

// Proveedor de contexto
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { isAuthenticated: !!localStorage.getItem('token') && isTokenValid(localStorage.getItem('token')), token: localStorage.getItem('token') });

    useEffect(() => {
        if (state.isAuthenticated) {
            localStorage.setItem('token', state.token);
        } else {
            localStorage.removeItem('token');
        }
    }, [state.isAuthenticated, state.token]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };