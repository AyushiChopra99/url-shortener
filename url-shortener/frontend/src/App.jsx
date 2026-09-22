import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    const res = await axios.get(`${API}/urls`);
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/shorten`, {
        original_url: url,
      });
      setResult(res.data);
      setUrl('');
      fetchHistory();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Paste a long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {result && (
        <div className="result">
          <p>Your short URL:</p>
          <a href={result.short_url} target="_blank" rel="noreferrer">
            {result.short_url}
          </a>
          <button onClick={() => copyToClipboard(result.short_url)}>
            Copy
          </button>
        </div>
      )}

      <h2>History</h2>
      <table>
        <thead>
          <tr>
            <th>Short</th>
            <th>Original</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.id}>
              <td>
                <a
                  href={`${API}/${row.short_code}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.short_code}
                </a>
              </td>
              <td className="original">{row.original_url}</td>
              <td>{row.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;