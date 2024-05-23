import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';

const SignupForm = () => {
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(ROUTES.START.path, { replace: true });
        }
    }, [state.isAuthenticated, navigate]);

    useEffect(() => {
        if (registrationSuccess) {
            navigate(ROUTES.LOGIN.path, { replace: true });
        }
    }, [registrationSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                // Marcar como exitoso si la petición fue exitosa
                alert('Usuario creado exitosamente');
                setRegistrationSuccess(true);
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje al usuario
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleChange}
                placeholder="Nombre de Usuario"
            />
            <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Correo Electrónico"
            />
            <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Contraseña"
            />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default SignupForm;
