// src/components/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white w-full sm:w-1/4 p-4">
      <h1 className="text-xl font-bold mb-6">Fleet Management</h1>
      <ul>
        <li className="mb-4"><a href="#vehicle-management">Vehicle Management</a></li>
        <li className="mb-4"><a href="#fleet-overview">Fleet Overview</a></li>
        <li className="mb-4"><a href="#charging-schedule">Charging Schedule</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
