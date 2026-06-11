import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [songTitle, setSongTitle] = useState('');
const [artistName, setArtistName] = useState('');
const [results, setResults] = useState([]);
const [stats, setStats] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/analyze',
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
    }
  };

  return (
    <div className="container">
      <h1>🎵 LyricLexicon</h1>

      <p className="subtitle">
        Analyze the vocabulary of your favorite songs.
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

        <button type="submit">
          Analyze Lyrics
        </button>
      </form>
      {stats && (
  <>
    <h2>Analysis Results</h2>

    <p>
      Total Words: <strong>{stats.totalWords}</strong>
    </p>

    <p>
      Unique Words: <strong>{stats.uniqueWords}</strong>
    </p>

<h3>🏆 Top 10 Most Used Words</h3>

<ol>
  {stats.topWords.map((item) => (
    <li key={item.word}>
      {item.word} ({item.count})
    </li>
  ))}
</ol>

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
  </>
)}
    </div>
  );
}

export default App;