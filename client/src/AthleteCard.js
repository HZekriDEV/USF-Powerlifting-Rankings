import React from 'react';

function AthleteCard({ athlete }) {
  return (
    <div>
      <h2>{athlete.name}</h2>
      <p>Weight Class: {athlete.weightClass}</p>
      <p>Strength Metric: {athlete.strengthMetric}</p>
      <p>Total: {athlete.total}</p>
    </div>
  );
}

export default AthleteCard;