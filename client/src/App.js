import React, { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';

function App() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    fetch('/api/athletes')
      .then(response => response.json())
      .then(data => setAthletes(data))
      .catch(err => console.error('Error fetching athletes:', err));
  }, []);

  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>
      <Leaderboard athletes={athletes} />
    </div>
  );
}

export default App;