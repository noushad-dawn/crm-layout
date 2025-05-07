import React, { useState, useEffect } from "react";
import config from "../config";

const PickupDirectory = () => {
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Fetch all pickups from the backend
    fetch(`api/pickups`)
      .then((response) => response.json())
      .then((data) => setPickups(data))
      .catch((err) => console.error("Failed to fetch pickups:", err));
  }, []);

  const handleFilter = () => {
    if (!selectedDate) return;

    const selectedDateObj = new Date(selectedDate);

    // Filter pickups by comparing the `date` field 
    const filtered = pickups.filter((pickup) => {
      const pickupDate = new Date(pickup.date);
      return (
        pickupDate.getFullYear() === selectedDateObj.getFullYear() &&
        pickupDate.getMonth() === selectedDateObj.getMonth() &&
        pickupDate.getDate() === selectedDateObj.getDate()
      );
    });

    setFilteredPickups(filtered);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Pickup Directory
      </h1>

      {/* Date Filter */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md transition"
        >
          Filter by Date
        </button>
      </div>

      {/* Pickup Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Customer Name</th>
              <th className="py-2 px-4 text-left">Phone Number</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Route</th>
              <th className="py-2 px-4 text-left">Driver Name</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(filteredPickups.length > 0 ? filteredPickups : pickups).map(
              (pickup) => (
                <tr
                  key={pickup._id}
                  className="hover:bg-gray-100 transition border-b"
                >
                  <td className="py-2 px-4">{pickup.customerName}</td>
                  <td className="py-2 px-4">{pickup.phoneNumber}</td>
                  <td className="py-2 px-4">{pickup.address}</td>
                  <td className="py-2 px-4">{pickup.location}</td>
                  <td className="py-2 px-4">{pickup.route}</td>
                  <td className="py-2 px-4">{pickup.driverId?.name}</td>
                  <td className="py-2 px-4">
                    {new Date(pickup.date).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupDirectory;
