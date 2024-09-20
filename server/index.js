const express = require('express');
const scraper = require('./scraper');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve React frontend
app.use(express.static('client/build'));

app.get('/api/athletes', async (req, res) => {
  try {
    const athletes = await scraper.getAthletes();
    res.json(athletes);
  } catch (error) {
    res.status(500).send('Error retrieving athletes data');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));