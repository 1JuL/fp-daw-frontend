import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';

const Start = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_APP_API_URL;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      setPosts(data.posts);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los tweets:', error);
      setError(error.message);
      setLoading(false);
      // Handle error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* {state.isAuthenticated && (
        <div>
          <h1>Bienvenido, {state.user.username}!</h1>
          <button onClick={() => navigate(ROUTES.LOGOUT.path)}>
            Cerrar sesión
          </button>
        </div>
      )}
      {error && <p>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.user.username}</strong>: {post.content}
          </li>
        ))}
      </ul>
      {loading && <p>Cargando tweets...</p>} */}
      Start
    </div>
  );
};

export default Start;