// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import VehicleManagement from './components/VehicleManagement';

const App = () => {
  return (
    <div className="flex">
      <Navbar />
      <main className="flex-grow p-6">
        <section id="vehicle-management">
          <VehicleManagement />
        </section>
        <section id="fleet-overview">
          <h2>Fleet Overview</h2>
          {/* Add Fleet Overview content */}
        </section>
        <section id="charging-schedule">
          <h2>Charging Schedule</h2>
          {/* Add Charging Schedule content */}
        </section>
      </main>
    </div>
  );
};

export default App;
