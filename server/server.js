const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'LyricLexicon backend is running!'
  });
});

app.post('/analyze', async (req, res) => {
  const { songTitle, artistName } = req.body;

  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${artistName}/${songTitle}`
    );

    const lyrics = response.data.lyrics;

    const words = lyrics
      .toLowerCase()
      .replace(/[^\w\s']/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const wordCounts = {};

    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedResults = Object.entries(wordCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([word, count]) => ({
        word,
        count
      }));

    res.json({
      success: true,
      totalWords: words.length,
      uniqueWords: sortedResults.length,
      results: sortedResults
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Lyrics not found.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});