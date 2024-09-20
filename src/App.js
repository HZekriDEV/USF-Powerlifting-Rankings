
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [athletes, setAthletes] = useState([]);
  const [name, setName] = useState('');
  const [filter, setFilter] = useState({ gender: '', weightClass: '', metric: 'total' });

  const fetchAthletes = async () => {
    try {
      const { data } = await axios.get('/athletes');
      setAthletes(data);
    } catch (error) {
      console.error('Error fetching athletes:', error);
    }
  };

  const addAthlete = async () => {
    try {
      const response = await axios.post('/add-athlete', { name });
      fetchAthletes();
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding athlete:', error);
    }
  };

  const applyFilter = async () => {
    const { data } = await axios.get('/athletes/filter', { params: filter });
    setAthletes(data);
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter athlete's Open Powerlifting username"
        />
        <button onClick={addAthlete}>Add Athlete</button>
      </div>

      <div>
        <select onChange={(e) => setFilter({ ...filter, gender: e.target.value })}>
          <option value="">All Genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        <input
          type="text"
          placeholder="Weight Class"
          onChange={(e) => setFilter({ ...filter, weightClass: e.target.value })}
        />

        <select onChange={(e) => setFilter({ ...filter, metric: e.target.value })}>
          <option value="total">Total</option>
          <option value="dots">DOTS</option>
          <option value="glPoints">GL Points</option>
        </select>

        <button onClick={applyFilter}>Apply Filter</button>
      </div>

      <ul>
        {athletes.map((athlete, index) => (
          <li key={index}>
            <p>Name: {athlete.name}</p>
            <p>Gender: {athlete.gender}</p>
            <p>Weight Class: {athlete.weightClass}</p>
            <p>Total: {athlete.total}</p>
            <p>DOTS: {athlete.dots}</p>
            <p>GL Points: {athlete.glPoints}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
