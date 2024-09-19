import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/dataService';
import Filters from './Filters';

const Leaderboard = () => {
  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const getAthletes = async () => {
      const data = await fetchData();
      setAthletes(data);
      setFilteredAthletes(data);
    };
    getAthletes();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    applyFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = (filters) => {
    let filtered = athletes;
    if (filters.weightClass) {
      filtered = filtered.filter(
        (athlete) => athlete.BodyweightKg == filters.weightClass
      );
    }
    if (filters.gender) {
      filtered = filtered.filter((athlete) => athlete.Sex === filters.gender);
    }
    // Apply more filters as needed
    setFilteredAthletes(filtered);
  };

  return (
    <div>
      <h1>Powerlifting Leaderboard</h1>
      <Filters onFilterChange={handleFilterChange} />
      {/* Add sorting components here */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight Class</th>
            <th>Gender</th>
            <th>Total</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete) => (
            <tr key={athlete.LifterID}>
              <td>{athlete.Name}</td>
              <td>{athlete.WeightClassKg}</td>
              <td>{athlete.Sex}</td>
              <td>{athlete.TotalKg}</td>
              {/* Add more data as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
