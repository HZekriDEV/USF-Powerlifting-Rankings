import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [athletes, setAthletes] = useState([]);
  const [query, setQuery] = useState('');
  const [metric, setMetric] = useState('total'); // Can be 'total', 'dots', 'glPoints'
  const [gender, setGender] = useState('all');
  const [weightClass, setWeightClass] = useState('all');

  // Fetch athletes data from Open Powerlifting API
  const fetchAthletes = async () => {
    const response = await axios.get('https://api.openpowerlifting.org/lifters');
    setAthletes(response.data);
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const filteredAthletes = athletes
    .filter((athlete) => {
      return gender === 'all' || athlete.sex === gender;
    })
    .filter((athlete) => {
      return weightClass === 'all' || athlete.weightclass === weightClass;
    })
    .sort((a, b) => b[metric] - a[metric]);

  const handleAddAthlete = async () => {
    const response = await axios.get(
      `https://api.openpowerlifting.org/lifters/${query}`
    );
    setAthletes((prevAthletes) => [...prevAthletes, response.data]);
  };

  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>

      <input
        type="text"
        placeholder="Search by athlete name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleAddAthlete}>Add Athlete</button>

      <div>
        <label htmlFor="metric">Sort By:</label>
        <select
          id="metric"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="total">Total</option>
          <option value="dots">DOTS</option>
          <option value="glPoints">GL Points</option>
        </select>

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="all">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        <label htmlFor="weightClass">Weight Class:</label>
        <select
          id="weightClass"
          value={weightClass}
          onChange={(e) => setWeightClass(e.target.value)}
        >
          <option value="all">All</option>
          <option value="59">59 kg</option>
          <option value="66">66 kg</option>
          <option value="74">74 kg</option>
          {/* Add more weight classes as needed */}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total</th>
            <th>DOTS</th>
            <th>GL Points</th>
            <th>Weight Class</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete) => (
            <tr key={athlete.id}>
              <td>{athlete.name}</td>
              <td>{athlete.total}</td>
              <td>{athlete.dots}</td>
              <td>{athlete.glPoints}</td>
              <td>{athlete.weightclass}</td>
              <td>{athlete.sex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
