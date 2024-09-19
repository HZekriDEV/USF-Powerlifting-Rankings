import React from 'react';

const Filters = ({ onFilterChange }) => {
  return (
    <div>
      <label>
        Weight Class:
        <input
          type="number"
          onChange={(e) => onFilterChange('weightClass', e.target.value)}
        />
      </label>
      <label>
        Gender:
        <select onChange={(e) => onFilterChange('gender', e.target.value)}>
          <option value="">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </label>
      {/* Add more filters as needed */}
    </div>
  );
};

export default Filters;
