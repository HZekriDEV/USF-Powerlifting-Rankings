import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [athletes, setAthletes] = useState([]);
  const [filter, setFilter] = useState({
    gender: 'All',
    weightClass: 'All',
    metric: 'total',
  });

  useEffect(() => {
    // Fetch athletes from localStorage
    let storedAthletes = JSON.parse(localStorage.getItem('athletes')) || [];
    // Apply filters
    if (filter.gender !== 'All') {
      storedAthletes = storedAthletes.filter(
        (athlete) => athlete.gender === filter.gender
      );
    }
    if (filter.weightClass !== 'All') {
      storedAthletes = storedAthletes.filter(
        (athlete) => athlete.weightClass === parseInt(filter.weightClass)
      );
    }
    // Sort by selected metric
    storedAthletes.sort((a, b) => b[filter.metric] - a[filter.metric]);
    setAthletes(storedAthletes);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <div>
        <label>
          Gender:
          <select name="gender" value={filter.gender} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="X">Other</option>
          </select>
        </label>
        <label>
          Weight Class:
          <select
            name="weightClass"
            value={filter.weightClass}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="59">59kg</option>
            <option value="66">66kg</option>
            <option value="74">74kg</option>
            <option value="83">83kg</option>
            <option value="93">93kg</option>
            <option value="105">105kg</option>
            <option value="120">120kg</option>
            <option value="120+">120+kg</option>
          </select>
        </label>
        <label>
          Metric:
          <select name="metric" value={filter.metric} onChange={handleFilterChange}>
            <option value="total">Total</option>
            <option value="dots">DOTS</option>
            <option value="gl">GL Points</option>
          </select>
        </label>
      </div>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Weight Class</th>
            <th>{filter.metric.toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id}>
              <td>{athlete.name}</td>
              <td>{athlete.gender}</td>
              <td>{athlete.weightClass}kg</td>
              <td>{athlete[filter.metric].toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
