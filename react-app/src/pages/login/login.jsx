import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';
import Logo from '../../assets/favicon.svg'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(ROUTES.START.path, { replace: true });
        }
    }, [state.isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                // Set token from response
                dispatch({ type: 'LOGIN', payload: token });
                localStorage.setItem('token', token);
                navigate(ROUTES.START.path, { replace: true });
            } else {
                // Handle failed login
                alert('Credenciales incorrectas. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error iniciando sesión:', error);
            // Handle error
        }
    };

    return (
        <div>
            {!state.isAuthenticated && (
                <div className='container'>
                    <img src={Logo} alt="Description of the image" />
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='submit'>Iniciar sesión</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;