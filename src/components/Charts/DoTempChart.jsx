import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  StreamingPlugin
);

export default function DoTempChart({ telemetry }) {
  const chartData = {
    datasets: [
      {
        label: 'Estimated DO (mg/L)',
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        fill: true,
        yAxisID: 'yDO',
        data: []
      },
      {
        label: 'Water Temp (°C)',
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        borderWidth: 2,
        yAxisID: 'yTemp',
        data: []
      },
      {
        label: 'EWMA Baseline (°C)',
        borderColor: '#6B7280',
        backgroundColor: '#6B7280',
        borderWidth: 1.5,
        borderDash: [5, 5],
        yAxisID: 'yTemp',
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
              const now = Date.now();
              chart.data.datasets[0].data.push({ x: now, y: telemetry.estimatedDO || 0 });
              chart.data.datasets[1].data.push({ x: now, y: telemetry.temperature || 0 });
              chart.data.datasets[2].data.push({ x: now, y: telemetry.baseline || 0 });
            }
          }
        },
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      },
      yDO: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'DO (mg/L)', color: '#0EA5E9' },
        min: 0,
        max: 12,
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      },
      yTemp: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Temp (°C)', color: '#F59E0B' },
        min: 15,
        max: 40,
        grid: { drawOnChartArea: false },
        ticks: { color: '#9CA3AF' }
      }
    },
    plugins: {
      legend: { labels: { color: '#F9FAFB' } }
    }
  };

  return (
    <div className="bg-cardbg border border-bordercolor rounded-xl p-5 h-80 w-full">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Live Dissolved Oxygen vs. Temperature Dynamics</h3>
      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}