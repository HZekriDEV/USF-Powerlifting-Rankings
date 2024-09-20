import React from 'react';
import AddAthlete from './components/AddAthlete';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>
      <AddAthlete />
      <Leaderboard />
    </div>
  );
}

export default App;
