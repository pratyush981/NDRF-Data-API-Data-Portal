import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';


const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/backend/data/output.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
          },
          error: (err) => setError(err.message),
        });
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>NDRF Disaster Relief</h1>
      {error && <p>Error fetching data: {error}</p>}
      <DataTable data={data} />
      <DataChart data={data} />
    </div>
  );
};

export default App;
