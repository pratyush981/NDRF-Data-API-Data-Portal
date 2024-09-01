import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/backend/data/output.csv`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const processedData = results.data.map(item => ({
              predicted_disaster: item.predicted_disaster,
              date: item.Date.trim(),
              location: item.Location.trim(),
              tweet: item.Tweet.trim()
            }));
            console.log('Fetched Data:', processedData);
            setData(processedData);
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const occurrencesByType = data.reduce((acc, item) => {
    acc[item.predicted_disaster] = (acc[item.predicted_disaster] || 0) + 1;
    return acc;
  }, {});

  const occurrencesByMonth = data.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(occurrencesByType),
    datasets: [
      {
        label: 'Occurrences by Disaster Type',
        data: Object.values(occurrencesByType),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(occurrencesByMonth),
    datasets: [
      {
        label: 'Occurrences by Month',
        data: Object.values(occurrencesByMonth),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } } } }} />
      <Bar data={lineChartData} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } } } }} />
    </div>
  );
};

export default DataChart;
