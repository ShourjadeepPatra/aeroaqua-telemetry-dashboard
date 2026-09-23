import React from 'react';
import { Chart as ChartJS } from 'chart.js';
import { Line } from 'react-chartjs-2';

export default function PhTurbidityChart({ telemetry }) {
  const chartData = {
    datasets: [
      {
        label: 'pH Level',
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        borderWidth: 2,
        yAxisID: 'ypH',
        data: []
      },
      {
        label: 'Turbidity (NTU)',
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF6',
        borderWidth: 2,
        yAxisID: 'yTurb',
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
              chart.data.datasets[0].data.push({ x: now, y: telemetry.ph || 7.0 });
              chart.data.datasets[1].data.push({ x: now, y: telemetry.turbidity || 0 });
            }
          }
        },
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      },
      ypH: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'pH', color: '#10B981' },
        min: 4,
        max: 10,
        grid: { color: '#1F2937' },
        ticks: { color: '#9CA3AF' }
      },
      yTurb: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Turbidity (NTU)', color: '#8B5CF6' },
        min: 0,
        max: 150,
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
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Water Chemistry (pH & Turbidity)</h3>
      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}