import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../config';

const DriverDirectory = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${config.baseURL}/api/drivers`);
      setDrivers(response.data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-left text-gray-800 mb-8">
        Driver Information
      </h1>
      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="py-3 px-6 font-semibold text-left">Name</th>
              <th className="py-3 px-6 font-semibold text-left">Driver ID</th>
              <th className="py-3 px-6 font-semibold text-left">Address</th>
              <th className="py-3 px-6 font-semibold text-left">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr
                key={driver.driverId}
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-6 border-b border-gray-200">{driver.name}</td>
                <td className="py-3 px-6 border-b border-gray-200">{driver.driverId}</td>
                <td className="py-3 px-6 border-b border-gray-200">{driver.address}</td>
                <td className="py-3 px-6 border-b border-gray-200">{driver.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverDirectory;
