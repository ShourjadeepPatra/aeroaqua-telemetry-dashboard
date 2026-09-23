'use client';

import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PhTurbidityChart({ history = [] }) {
  const data = {
    labels: history.map((item) => item.timestamp),
    datasets: [
      {
        label: 'pH Level',
        data: history.map((item) => item.ph),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Turbidity (NTU)',
        data: history.map((item) => item.turbidity),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { size: 10 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 4,
        max: 10,
        title: { display: true, text: 'pH', color: '#10b981' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 150,
        title: { display: true, text: 'Turbidity (NTU)', color: '#a855f7' },
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
    },
    plugins: {
      legend: { labels: { color: '#e5e7eb', font: { size: 11 } } },
    },
  };

  return (
    <div className="w-full h-64 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Water Chemistry (pH & Turbidity)</h3>
      <div className="w-full h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}