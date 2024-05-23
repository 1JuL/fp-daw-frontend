import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../components/Button';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';
import './start.css'

const Start = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // nuevo estado para los resultados de la búsqueda
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, dispatch } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userName = decodedToken ? decodedToken.userName : null;
  const API_URL = import.meta.env.VITE_APP_API_URL;

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

  const fetchPosts = async () => {
    setLoading(true);
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

      const response = await fetch(`${API_URL}/users/posts/`, {
        headers, // Agrega el encabezado a la solicitud fetch
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setPosts([]); // Limpia los tweets anteriores
    const query = searchQuery.trim();
    if (query) {
      try {
        const response = await fetch(`${API_URL}/search?query=${query}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        const data = await response.json();
        setSearchResults(data.posts);
        setLoading(false);
      } catch (error) {
        console.error('Error al buscar tweets:', error);
        setError(error.message);
        setLoading(false);
        // Handle error
      }
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setPosts([]);
      setSearchResults([]);
      fetchPosts();
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, []);

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
      <div className="timeline-search">
        {error && <p>{error}</p>}
        <div className="post-list">
          {posts.map((post, index) => (
            <div key={`${post.id}-${index}`} className="post-card">
              <h2>{post.username}</h2>
              <p>{post.content}</p>
            </div>
          ))}
          {searchResults.map((post, index) => (
            <div key={`${post.id}-${index}`} className="post-card">
              <h2>{post.username}</h2>
              <p>{post.content}</p>
            </div>
          ))}
          {loading && <p>Cargando tweets...</p>}
        </div>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tweets"
          />
          <Button className="search-button" callback={handleSearch} label="Buscar" />
        </div>
      </div>

    </div>
  );
};

export default Start;
