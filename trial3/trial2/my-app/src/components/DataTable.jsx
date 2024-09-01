import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/backend/data/output.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: results => {
            setData(results.data);
          },
          error: error => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

  if (data.length === 0) {
    return <div>No data available to display.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Tweet Description</th>
          <th>Type of Disaster</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.Date}</td>
            <td>{row.Location}</td>
            <td>{row.Tweet}</td>
            <td>{row.predicted_disaster}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
