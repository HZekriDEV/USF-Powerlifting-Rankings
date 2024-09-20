
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 5000;

let athletes = [];

// Scraping function to get powerlifting data from Open Powerlifting
const scrapeAthleteData = async (athleteName) => {
  try {
    const { data } = await axios.get(`https://www.openpowerlifting.org/u/${athleteName}`);
    const $ = cheerio.load(data);
    const athlete = {};

    // Parsing athlete data
    athlete.name = $('h1').text();
    athlete.gender = $('tr:contains("Sex") td').text();
    athlete.weightClass = $('tr:contains("Bodyweight Class") td').text();
    athlete.total = $('tr:contains("Total") td').text();
    athlete.dots = $('tr:contains("Dots") td').text();
    athlete.glPoints = $('tr:contains("GL Points") td').text();

    return athlete;
  } catch (error) {
    console.error("Error fetching athlete data:", error);
    return null;
  }
};

// API to add an athlete
app.post('/add-athlete', async (req, res) => {
  const athleteName = req.body.name;
  const athlete = await scrapeAthleteData(athleteName);
  if (athlete) {
    athletes.push(athlete);
    res.json({ message: 'Athlete added successfully!', athlete });
  } else {
    res.status(404).json({ message: 'Athlete not found.' });
  }
});

// API to get all athletes
app.get('/athletes', (req, res) => {
  res.json(athletes);
});

// API to filter athletes
app.get('/athletes/filter', (req, res) => {
  const { gender, weightClass, metric } = req.query;
  let filteredAthletes = athletes;

  if (gender) filteredAthletes = filteredAthletes.filter(a => a.gender === gender);
  if (weightClass) filteredAthletes = filteredAthletes.filter(a => a.weightClass === weightClass);
  if (metric === 'total') filteredAthletes.sort((a, b) => b.total - a.total);
  if (metric === 'dots') filteredAthletes.sort((a, b) => b.dots - a.dots);
  if (metric === 'glPoints') filteredAthletes.sort((a, b) => b.glPoints - a.glPoints);

  res.json(filteredAthletes);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
