import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Define the types for your chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    fill: boolean;
  }[];
}

interface MultilineInterface {
   name: string;
}

const MultiLineChart: React.FC<MultilineInterface> = ({name}) => {
  // Define your data
  const data: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 20, 30, 50, 70, 80, 100],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 50, 60, 10, 0],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Dataset 3',
        data: [50, 60, 70, 40, 80, 90, 100],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Define chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  return (
    <div className='bg-white shadow-sm rounded-md p-2'>
      <h2 className='font-[500]'>{name}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default MultiLineChart;
