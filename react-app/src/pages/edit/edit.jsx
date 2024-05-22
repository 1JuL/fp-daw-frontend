import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditTweet = () => {
    const { username, index } = useParams();
    const [tweet, setTweet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTweet = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/posts/${index}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setTweet(data.post);
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
            const response = await fetch(`http://localhost:3000/users/${username}/posts/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: tweet.content
                })
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            alert("Editado correctamente");
            navigate("/overview", { replace: true });
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
            <h1>Edit Tweet</h1>
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
                    <textarea value={tweet.content} onChange={(e) => setTweet({ ...tweet, content: e.target.value })}></textarea>
                </div>
                <button type="button" onClick={handleSave}>Save</button>
            </form>
        </div>
    );
}

export default EditTweet;
