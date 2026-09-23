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

export default function DoTempChart({ history = [] }) {
  const data = {
    labels: history.map((item) => item.timestamp),
    datasets: [
      {
        label: 'Estimated DO (mg/L)',
        data: history.map((item) => item.estimatedDo),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Water Temp (°C)',
        data: history.map((item) => item.temperature),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        yAxisID: 'y1',
      },
      {
        label: 'EWMA Baseline (°C)',
        data: history.map((item) => item.ewmaBaseline),
        borderColor: '#6b7280',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    animation: false, // Prevents redraw hitching on live updates
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
        title: { display: true, text: 'DO (mg/L)', color: '#06b6d4' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Temp (°C)', color: '#f59e0b' },
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
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Live Dissolved Oxygen vs. Temperature Dynamics</h3>
      <div className="w-full h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}