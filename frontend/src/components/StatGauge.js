import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { left, right, top, bottom } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const value = chart.config.data.datasets[0].data[0];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = '700 22px Inter, Arial, sans-serif';
    ctx.fillText(value, centerX, centerY);
    ctx.restore();
  },
};

const StatGauge = ({ label, value, max, color }) => {
  const safeMax = max > 0 ? max : 1;
  const remaining = Math.max(safeMax - value, 0);

  const data = {
    datasets: [
      {
        data: [value, remaining],
        backgroundColor: [color, 'rgba(255,255,255,0.08)'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '72%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div className="stat-gauge">
      <div className="stat-gauge-ring">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      <p className="stat-gauge-label">{label}</p>
    </div>
  );
};

export default StatGauge;