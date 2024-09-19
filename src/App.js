// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AddAthlete from './components/AddAthlete';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/add-athlete" element={<AddAthlete />} />
      </Routes>
    </Router>
  );
}

export default App;
