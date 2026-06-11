import { useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
  event.preventDefault();

  setLoading(true);

  try {
    const response = await axios.post(
      'https://lyriclexicon-api.onrender.com/analyze',
      {
        songTitle,
        artistName
      }
    );

    const sortedByFrequency = [...response.data.results]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setResults(response.data.results);

    setStats({
      totalWords: response.data.totalWords,
      uniqueWords: response.data.uniqueWords,
      topWords: sortedByFrequency
    });

  } catch (error) {
    alert('Lyrics not found.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

      

  return (
    <div className="container">
      <div className="hero">
        <h1>🎵 LyricLexicon</h1>

        <p className="subtitle">
          Discover the vocabulary hidden in your favorite songs.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Artist Name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
  {loading ? 'Analyzing...' : 'Analyze Lyrics'}
</button>
        </form>
      </div>

      {stats && (
        <>
          <div className="stats">
            <div className="stat-card">
              <h2>{stats.totalWords}</h2>
              <p>Total Words</p>
            </div>

            <div className="stat-card">
              <h2>{stats.uniqueWords}</h2>
              <p>Unique Words</p>
            </div>
          </div>

          <div className="section top-words">
            <h3>🏆 Top 10 Most Used Words</h3>

            <ol>
              {stats.topWords.map((item) => (
                <li key={item.word}>
                  {item.word} ({item.count})
                </li>
              ))}
            </ol>
          </div>

          <div className="section">
            <h3>📖 Full Word Dictionary</h3>

            <table>
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Count</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr key={item.word}>
                    <td>{item.word}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

<footer>
  Made with ❤️ using React, Express, and Lyrics.ovh
</footer>
    </div>
  );
}

export default App;