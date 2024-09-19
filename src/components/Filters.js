import React from 'react';

function Filters({ filters, setFilters }) {
  const handleGenderChange = (e) => {
    setFilters({ ...filters, gender: e.target.value });
  };

  const handleWeightClassChange = (e) => {
    setFilters({ ...filters, weightClass: e.target.value });
  };

  const handleMetricChange = (e) => {
    setFilters({ ...filters, metric: e.target.value });
  };

  return (
    <div>
      <label>
        Gender:
        <select value={filters.gender} onChange={handleGenderChange}>
          <option value="">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </label>

      <label>
        Weight Class:
        <select value={filters.weightClass} onChange={handleWeightClassChange}>
          <option value="">All</option>
          {/* Add weight classes as options */}
          <option value="59">59kg</option>
          <option value="66">66kg</option>
          <option value="74">74kg</option>
          {/* ... */}
        </select>
      </label>

      <label>
        Metric:
        <select value={filters.metric} onChange={handleMetricChange}>
          <option value="total">Total</option>
          <option value="dots">DOTS</option>
          <option value="glPoints">GL Points</option>
          {/* ... */}
        </select>
      </label>
    </div>
  );
}

export default Filters;
