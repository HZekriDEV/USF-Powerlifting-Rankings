import React, { useState } from 'react';

function AddAthlete() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const addAthlete = (e) => {
    e.preventDefault();
    setStatus('Adding athlete...');
    // Simulate adding athlete by updating localStorage
    let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    const newAthlete = {
      id: Date.now(),
      name: name,
      gender: 'M',
      weightClass: 93,
      total: Math.floor(Math.random() * 800),
      dots: Math.random() * 600,
      gl: Math.random() * 120,
    };
    athletes.push(newAthlete);
    localStorage.setItem('athletes', JSON.stringify(athletes));
    setStatus('Athlete added successfully!');
    setName('');
  };

  return (
    <div>
      <h2>Add Athlete</h2>
      <form onSubmit={addAthlete}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Athlete Name"
          required
        />
        <button type="submit">Add</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default AddAthlete;
