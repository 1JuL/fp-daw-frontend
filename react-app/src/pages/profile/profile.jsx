import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;

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
                console.log(userName);
        
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
                const response = await fetch(`${API_URL}/users/${username}/posts/${index}`, { // Use template literals for URL
                    method: 'DELETE'
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

    const containerStyle = {
        backgroundColor: 'grey',
        marginBottom: '10px'
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
        <div>
            <h1>Profile</h1>
            {posts.map((post) => (
                <div key={post.index} style={containerStyle}>
                    <h3 id='username'>{post.username}</h3>
                    <h4 id='index'>{post.index}</h4>
                    <div>
                        <p id='content'>{post.content}</p>
                    </div>
                    <button onClick={() => handleEdit(post.username, post.index)}>Edit</button>
                    <button onClick={() => handleDelete(post.username, post.index)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default Profile