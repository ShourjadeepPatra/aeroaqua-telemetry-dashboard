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

export default function OpticalKdChart({ history = [] }) {
  const data = {
    labels: history.map((item) => item.timestamp),
    datasets: [
      {
        label: 'Attenuation Kd (m⁻¹)',
        data: history.map((item) => item.kd),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
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
        min: 0,
        max: 6,
        title: { display: true, text: 'Kd Index (m⁻¹)', color: '#ef4444' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' },
      },
    },
    plugins: {
      legend: { labels: { color: '#e5e7eb', font: { size: 11 } } },
    },
  };

  return (
    <div className="w-full h-64 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Optical Attenuation (Algae Bloom Indicator Kd)</h3>
      <div className="w-full h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}