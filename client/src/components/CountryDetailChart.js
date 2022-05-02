import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CountryDetailChart = ({ caseType, dates, seriesData }) => {
  console.log(dates, seriesData)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: caseType,
      },
    },
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: caseType,
        data: seriesData,
        borderColor: caseType === 'New Cases' ? 'rgb(82, 78, 183)' : 'rgb(255, 35, 0)',
        backgroundColor: caseType === 'New Cases' ? 'rgb(82, 78, 183)' : 'rgb(255, 35, 0)',
      }
    ],
  };

  return <Line options={options} data={data} />;
};

export default CountryDetailChart;
