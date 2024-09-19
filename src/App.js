import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AthleteList from './components/AthleteList';
import AthleteSearch from './components/AthleteSearch';
import Filters from './components/Filters';

function App() {
  const [athletes, setAthletes] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    weightClass: '',
    metric: 'total',
  });

  const addAthlete = async (name) => {
    try {
      const response = await axios.get(
        `/.netlify/functions/fetchAthlete?name=${encodeURIComponent(name)}`
      );
      const data = response.data;

      if (data.length > 0) {
        setAthletes([...athletes, data[0]]);
      } else {
        alert('Athlete not found.');
      }
    } catch (error) {
      console.error('Error fetching athlete data:', error);
    }
  };

  const filteredAthletes = athletes
    .filter((athlete) => {
      if (filters.gender && athlete.sex !== filters.gender) return false;
      if (filters.weightClass && athlete.weightClass !== filters.weightClass)
        return false;
      return true;
    })
    .sort((a, b) => b[filters.metric] - a[filters.metric]);

  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>
      <AthleteSearch addAthlete={addAthlete} />
      <Filters filters={filters} setFilters={setFilters} />
      <AthleteList athletes={filteredAthletes} metric={filters.metric} />
    </div>
  );
}

export default App;
