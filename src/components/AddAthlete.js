// src/components/AddAthlete.js
import React, { useState } from 'react';
import { fetchData } from '../services/dataService';

const AddAthlete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await fetchData();
    const filtered = data.filter((athlete) =>
      athlete.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  const handleAdd = (athlete) => {
    // Logic to add athlete to your list or database
    console.log('Athlete added:', athlete);
  };

  return (
    <div>
      <h1>Add Athlete</h1>
      <input
        type="text"
        placeholder="Search for an athlete"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((athlete) => (
          <li key={athlete.LifterID}>
            {athlete.Name} - {athlete.Country}
            <button onClick={() => handleAdd(athlete)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddAthlete;
