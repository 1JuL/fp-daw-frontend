import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../components/Button';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';
import './profile.css'

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;

    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const userName = decodedToken ? decodedToken.userName : null;

    const gotoHome = () => {
        navigate(ROUTES.START.path, { replace: true });
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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Decode the token
                const token = localStorage.getItem("token");
                if (!token) {
                    // Redirige al usuario a la página de inicio de sesión o muestra un mensaje de error
                    return <div>No se encontró el token de autenticación</div>;
                }

                const decodedToken = jwtDecode(token);
                const userName = decodedToken.userName;

                // Agrega el token al encabezado de autorización
                const headers = new Headers();
                headers.append("Authorization", `Bearer ${token}`);

                const response = await fetch(`${API_URL}/users/${userName}/posts/`, {
                    headers, // Agrega el encabezado a la solicitud fetch
                });

                // Si la respuesta no es OK, lanza un error
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setPosts(data.posts || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleEdit = (username, index) => {
        navigate(`/edit/${username}/${index}`);
    };

    const handleDelete = async (username, index) => {
        if (window.confirm("¿Estás seguro de que deseas borrar este tweet?")) {
            try {
                // Decode the token
                const token = localStorage.getItem("token");
                if (!token) {
                    // Redirige al usuario a la página de inicio de sesión o muestra un mensaje de error
                    return <div>No se encontró el token de autenticación</div>;
                }

                const decodedToken = jwtDecode(token);
                const userName = decodedToken.userName;

                // Agrega el token al encabezado de autorización
                const headers = new Headers();
                headers.append("Authorization", `Bearer ${token}`);
                const response = await fetch(`${API_URL}/users/${username}/posts/${index}`, { // Use template literals for URL
                    method: 'DELETE',
                    headers,
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                setPosts(posts.filter(post => !(post.username === username && post.index === index)));
                setSuccessMessage("Tweet borrado correctamente");
            } catch (error) {
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        if (successMessage) {
            window.alert(successMessage);
            setSuccessMessage(null);
        }
    }, [successMessage]);

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
                    <div className="home-container">
                        <Button className="home-button" callback={gotoHome} label="Home" />
                    </div>
                    <div className="new-tweet-container">
                        <Button className="new-tweet-button" callback={gotoNewTweet} label="New Tweet" />
                    </div>
                    <div className="logout-container">
                        <Button className="logout-button" callback={logout} label="Logout" />
                    </div>
                </div>
            </div>
            <div className="post-list">
                {posts.map((post) => (
                    <div className="post-card" key={post.index}>
                        <div className='id-index'>
                            <h2 id='username'>{post.username}</h2>
                            <h4 id='index'>{post.index}</h4>
                        </div>
                        <div>
                            <p id='content'>{post.content}</p>
                        </div>
                        <div className='buttons-edit-delete'>
                            <button className='edit-button' onClick={() => handleEdit(post.username, post.index)}>Edit</button>
                            <button className='delete-button' onClick={() => handleDelete(post.username, post.index)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile