// src/components/FleetOverview.js
import React from 'react';

const FleetOverview = ({ vehicles }) => {
  // Step 5.2: Vehicle Status Counts
  const statusCounts = {
    inTransit: vehicles.filter((vehicle) => vehicle.status === 'In Transit').length,
    charging: vehicles.filter((vehicle) => vehicle.status === 'Charging').length,
    idle: vehicles.filter((vehicle) => vehicle.status === 'Idle').length,
  };

  // Step 5.3: Fleet-Wide Battery Health
  // Calculate average battery percentage
  const totalBattery = vehicles.reduce((sum, vehicle) => sum + vehicle.battery, 0);
  const averageBattery = vehicles.length > 0 ? totalBattery / vehicles.length : 0;

  // Count vehicles with battery below 20%
  const lowBatteryCount = vehicles.filter((vehicle) => vehicle.battery < 20).length;

  // Estimated full charge time for charging vehicles
  const estimatedChargeTime = vehicles
    .filter((vehicle) => vehicle.status === 'Charging' && vehicle.battery < 100)
    .reduce((totalTime, vehicle) => {
      const remainingCharge = 100 - vehicle.battery;
      const cycles = Math.ceil(remainingCharge / 10); // Each cycle adds 10%
      return totalTime + cycles * 10; // Each cycle takes 10 minutes
    }, 0);

  return (
    <div className="fleet-overview p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Fleet Overview</h2>

      {/* Vehicle Status Counts */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Vehicle Status</h3>
        <p>In Transit: {statusCounts.inTransit}</p>
        <p>Charging: {statusCounts.charging}</p>
        <p>Idle: {statusCounts.idle}</p>
      </div>

      {/* Fleet-Wide Battery Health */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Fleet-Wide Battery Health</h3>
        <p>Average Battery Level: {averageBattery.toFixed(2)}%</p>
        <p>Vehicles with Battery Below 20%: {lowBatteryCount}</p>
        <p>Estimated Full Charge Time for Charging Vehicles: {estimatedChargeTime} minutes</p>
      </div>
    </div>
  );
};

export default FleetOverview;
