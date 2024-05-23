import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../components/Button';
import { ROUTES } from '../../routes';
import './edit.css';

const EditTweet = () => {
  const { username, index } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(''); // Inicializado como string vacío
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
    const token = localStorage.getItem("token");
    const fetchTweet = async () => {
      try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);

        const response = await fetch(`${API_URL}/users/${username}/posts/${index}`, { headers });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTweet(data.post);
        setContent(data.post.content || ''); // Asegurarse de que el contenido no sea undefined
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [username, index]);

  const handleSave = async () => {
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
        content: content // Solo enviamos el contenido
      };
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(`${API_URL}/users/${username}/posts/${index}`, {
        method: "PUT", // Cambiado a PUT para actualizar
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert("Editado correctamente");
      navigate("/profile", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROFILE.path, { replace: true });
  };

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
      <div className="edit-post">
        <form>
          <div className='post-card'>
            <div className='id-index'>
              <div>
                <h2 id='username'>{tweet.username}</h2>
              </div>
              <div>
                <h4 id='index'>{tweet.index}</h4>
              </div>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            <div className='buttons-edit-delete'>
              <button className='delete-button' type="button" onClick={handleCancel}>Cancel</button>
              <button className='edit-button' type="button" onClick={handleSave}>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTweet;
