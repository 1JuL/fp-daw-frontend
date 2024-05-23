import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../components/Button';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';
import './post.css'

const NewPost = ({ username }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;

    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const userName = decodedToken ? decodedToken.userName : null;

    const gotoProfile = () => {
        navigate(ROUTES.PROFILE.path, { replace: true });
    };

    const gotoNewTweet = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Redirige al usuario a la página de inicio de sesión o muestra un mensaje de error
            return <div>No se encontró el token de autenticación</div>;
        }

        const decodedToken = jwtDecode(token);
        const userName = decodedToken.userName;
        navigate(`/newpost/${userName}`, { replace: true });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        navigate(ROUTES.HOME.path, { replace: true });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No se encontró el token de autenticación");
                return;
            }

            if (content.trim() === '') {
                setError("Content cannot be empty");
                return;
            }

            const body = {
                post: content // Cambia content a post
            };
            const headers = new Headers();
            headers.append("Authorization", `Bearer ${token}`);
            headers.append("Content-Type", "application/json");

            const response = await fetch(`${API_URL}/users/${userName}/new-post`, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            // Si la respuesta no es OK, lanza un error
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setSuccessMessage("Tweet creado correctamente");
            setContent('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.START.path, { replace: true });
    };

    useEffect(() => {
        if (successMessage) {
            alert(successMessage);
            navigate(ROUTES.START.path, { replace: true });
        }
    }, [successMessage, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='main-container'>
            <div className="menu">
                <div className="menu-container">
                    <div className="username-container">
                        <span>{`${userName}`}</span>
                    </div>
                    <div className="profile-container">
                        <Button className="profile-button" callback={gotoProfile} label="Profile" />
                    </div>
                    <div className="new-tweet-container">
                        <Button className="new-tweet-button" callback={gotoNewTweet} label="New Tweet" />
                    </div>
                    <div className="logout-container">
                        <Button className="logout-button" callback={logout} label="Logout" />
                    </div>
                </div>
            </div>
            <div className='edit-post'>
                <form onSubmit={handleSubmit}>
                    <div className='post-card'>
                        <h2>{userName}</h2>
                        <input
                            type="text"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Digite el contenido del post..."
                        />
                        <div className='buttons-edit-delete'>
                            <button className='delete-button' type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className='edit-button' type="submit" disabled={!content}>
                                Create Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPost;