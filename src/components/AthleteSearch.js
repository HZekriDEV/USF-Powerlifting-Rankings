import React, { useState } from 'react';

function AthleteSearch({ addAthlete }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addAthlete(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search Athlete"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Athlete</button>
    </form>
  );
}

export default AthleteSearch;
