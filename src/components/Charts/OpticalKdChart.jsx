import React from 'react';
import { Chart as ChartJS } from 'chart.js';
import { Line } from 'react-chartjs-2';

export default function OpticalKdChart({ telemetry }) {
  const chartData = {
    datasets: [
      {
        label: 'Attenuation Kd (m⁻¹)',
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        data: []
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          delay: 1000,
          refresh: 1000,
          duration: 60000,
          onRefresh: (chart) => {
            if (telemetry) {
              chart.data.datasets[0].data.push({ x: Date.now(), y: telemetry.kd || 0 });
            }
          }
        },
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Kd Index (m⁻¹)', color: '#EF4444' },
        min: 0,
        max: 6,
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      }
    },
    plugins: {
      legend: { labels: { color: '#F9FAFB' } }
    }
  };

  return (
    <div className="bg-cardbg border border-bordercolor rounded-xl p-5 h-80 w-full">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Optical Attenuation (Algae Bloom Indicator Kd)[cite: 1, 2]</h3>
      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}