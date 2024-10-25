// src/components/BatteryHealthChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const BatteryHealthChart = ({ vehicles }) => {
  const batteryData = {
    labels: vehicles.map((vehicle) => `Vehicle ${vehicle.id}`),
    datasets: [
      {
        label: 'Battery Health (%)',
        data: vehicles.map((vehicle) => vehicle.battery),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold mb-2">Battery Health Over Time</h2>
      <Line data={batteryData} />
    </div>
  );
};

export default BatteryHealthChart;
