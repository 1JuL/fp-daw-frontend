import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditTweet = () => {
  const { username, index } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(''); // Inicializado como string vacío
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_URL;

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <form>
        <div>
          <label>Username: </label>
          <h2>{tweet.username}</h2>
        </div>
        <div>
          <label>Index: </label>
          <h2>{tweet.index}</h2>
        </div>
        <div>
          <label>Content: </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}

export default EditTweet;
