import React from 'react';

const Sorting = ({ onSortChange }) => {
  return (
    <div>
      <label>
        Sort By:
        <select onChange={(e) => onSortChange(e.target.value)}>
          <option value="TotalKg">Total</option>
          <option value="Dots">DOTS</option>
          <option value="GLPoints">GL Points</option>
          {/* Add more metrics as needed */}
        </select>
      </label>
    </div>
  );
};

export default Sorting;
