import React from 'react';

function AthleteList({ athletes, metric }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Weight Class</th>
          <th>{metric.toUpperCase()}</th>
        </tr>
      </thead>
      <tbody>
        {athletes.map((athlete, index) => (
          <tr key={index}>
            <td>{athlete.name}</td>
            <td>{athlete.sex}</td>
            <td>{athlete.weightClass}</td>
            <td>{athlete[metric]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AthleteList;
