// src/components/VehicleManagement.js
import React, { useState, useEffect } from 'react';
import FleetOverview from './FleetOverview';
import BatteryHealthChart from './BatteryHealthChart';

const VehicleManagement = () => {
  // Define state variables
  const [vehicles, setVehicles] = useState([
    { id: 1, battery: 90, distance: 100, lastCharge: '2023-10-01', status: 'In Transit', scheduledChargeTime: null },
    { id: 2, battery: 45, distance: 300, lastCharge: '2023-10-05', status: 'Charging', scheduledChargeTime: null },
    { id: 3, battery: 15, distance: 50, lastCharge: '2023-10-02', status: 'Idle', scheduledChargeTime: null },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    id: '',
    battery: '',
    distance: '',
    lastCharge: '',
    status: 'Idle',
    scheduledChargeTime: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Track IDs of vehicles with low battery
  const [lowBatteryIds, setLowBatteryIds] = useState([]);

  // Real-Time Battery Status Update
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === 'In Transit' && vehicle.battery > 0) {
            return { ...vehicle, battery: vehicle.battery - 1 };
          } else if (vehicle.status === 'Charging' && vehicle.battery < 100) {
            return { ...vehicle, battery: Math.min(100, vehicle.battery + 10) };
          }
          return vehicle; // Idle or no changes
        })
      );
    }, 3000); // Adjust interval time as needed for simulation

    return () => clearInterval(interval);
  }, []);

   // Scheduled Charging Management
   useEffect(() => {
    vehicles.forEach((vehicle) => {
      if (vehicle.scheduledChargeTime) {
        const scheduledTime = new Date(vehicle.scheduledChargeTime).getTime();
        const now = new Date().getTime();
        
        if (scheduledTime > now) {
          const timeout = setTimeout(() => {
            setVehicles((prevVehicles) =>
              prevVehicles.map((v) =>
                v.id === vehicle.id ? { ...v, status: 'Charging' } : v
              )
            );
          }, scheduledTime - now);

          // Clear timeout if vehicle data changes
          return () => clearTimeout(timeout);
        }
      }
    });
  }, [vehicles]);

  // Handle Scheduled Charging Time
  const handleScheduleChange = (id, time) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, scheduledChargeTime: time } : vehicle
      )
    );
  };

  // Battery Alert for Low Battery Vehicles
  useEffect(() => {
    const checkLowBattery = () => {
      const lowBatteryVehicles = vehicles
        .filter((vehicle) => vehicle.battery < 15)
        .map((vehicle) => vehicle.id);

      setLowBatteryIds(lowBatteryVehicles);
      
      if (lowBatteryVehicles.length > 0) {
        alert(`Warning: Vehicle(s) with ID(s) ${lowBatteryVehicles.join(', ')} have low battery!`);
      }
    };

    const alertInterval = setInterval(checkLowBattery, 5000); // Check every 5 seconds
    return () => clearInterval(alertInterval);
  }, [vehicles]);

  // Add a new vehicle
  const addVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.id || !newVehicle.battery || !newVehicle.distance || !newVehicle.lastCharge) return;

    setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
    setNewVehicle({ id: '', battery: '', distance: '', lastCharge: '', status: 'Idle' });
  };

  // Edit an existing vehicle
  const editVehicle = (id) => {
    const vehicleToEdit = vehicles.find((v) => v.id === id);
    setNewVehicle(vehicleToEdit);
    setIsEditing(true);
    setEditId(id);
  };

  const saveVehicleEdit = (e) => {
    e.preventDefault();
    setVehicles(
      vehicles.map((v) => (v.id === editId ? { ...v, ...newVehicle } : v))
    );
    setIsEditing(false);
    setNewVehicle({ id: '', battery: '', distance: '', lastCharge: '', status: 'Idle' });
  };

  // Delete a vehicle
  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <div classname="p-4">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>

      {/* Battery Health Chart */}
      <BatteryHealthChart vehicles={vehicles} />

      {/* Fleet Overview Dashboard */}
      <FleetOverview vehicles={vehicles} />

      {/* Add/Edit Vehicle Form */}
      <form onSubmit={isEditing ? saveVehicleEdit : addVehicle} className="mb-6 flex flex-col md:flex-row md:space-x-2">
        <input
          type="number"
          placeholder="Battery %"
          value={newVehicle.battery}
          onChange={(e) => setNewVehicle({ ...newVehicle, battery: e.target.value })}
          required
          className="p-2 border rounded mb-2 md:mb-0 flex-1"
        />
        <input
          type="number"
          placeholder="Distance"
          value={newVehicle.distance}
          onChange={(e) => setNewVehicle({ ...newVehicle, distance: e.target.value })}
          required
          className="p-2 border rounded mb-2 md:mb-0 flex-1"
        />
        <input
          type="date"
          placeholder="Last Charge"
          value={newVehicle.lastCharge}
          onChange={(e) => setNewVehicle({ ...newVehicle, lastCharge: e.target.value })}
          required
          className="p-2 border rounded mb-2 md:mb-0 flex-1"
        />
        <select
          value={newVehicle.status}
          onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
          className="p-2 border rounded mb-2"
        >
          <option value="In Transit">In Transit</option>
          <option value="Charging">Charging</option>
          <option value="Idle">Idle</option>
        </select>
        <input
          type="time"
          onChange={(e) => handleScheduleChange(vehicle.id, e.target.value)}
          placeholder="Schedule Charging"
          className="p-2 border rounded mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded flex-none">
          {isEditing ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </form>

      {/* Display Vehicle List */}
      <ul className="space-y-4">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            className={`border p-4 rounded-lg ${
              lowBatteryIds.includes(vehicle.id) ? 'bg-red-300' : ''
            }`}
          >
            <h3 className="text-xl font-semibold">Vehicle ID: {vehicle.id}</h3>
            <p>Battery: {vehicle.battery}%</p>
            <p>Distance: {vehicle.distance} km</p>
            <p>Last Charge: {vehicle.lastCharge}</p>
            <p>Status: {vehicle.status}</p>
            <p>Scheduled Charge: {vehicle.scheduledChargeTime || 'None'}</p>

            {/* Schedule Charging Time Input */}
            <input
              type="datetime-local"
              value={vehicle.scheduledChargeTime || ''}
              onChange={(e) => handleScheduleChange(vehicle.id, e.target.value)}
              className="p-2 border rounded mb-2"
            />
            <button onClick={() => editVehicle(vehicle.id)} className="p-1 bg-yellow-500 text-white rounded mr-2">
              Edit
            </button>
            <button onClick={() => deleteVehicle(vehicle.id)} className="p-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleManagement;
