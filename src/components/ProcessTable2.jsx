import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import config from './config';

const  ProcessTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only once when the component mounts

  const fetchData = async () => {
    try {
      const response = await api.get(`api/orders/process/Pending`); // Fetch only 'Pending' orders
      setFilteredData(response.data || []);
    } catch (error) {
      setError('No pending orders found');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>

      {/* Data Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Order ID</th>
            <th className="border border-gray-200 px-4 py-2">Username</th>
            <th className="border border-gray-200 px-4 py-2">User ID</th>
            <th className="border border-gray-200 px-4 py-2">Product</th>
            <th className="border border-gray-200 px-4 py-2">Price</th>
            <th className="border border-gray-200 px-4 py-2">Unit</th>
            <th className="border border-gray-200 px-4 py-2">Category</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan="8" className="border border-gray-200 px-4 py-2 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2">{item.orderId}</td>
                <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                <td className="border border-gray-200 px-4 py-2">{item.userID}</td>
                <td className="border border-gray-200 px-4 py-2">{item.products}</td>
                <td className="border border-gray-200 px-4 py-2">₹{item.totalPrice.toFixed(2)}</td>
                <td className="border border-gray-200 px-4 py-2">{item.units}</td>
                <td className="border border-gray-200 px-4 py-2">{item.category}</td>
                <td className="border border-gray-200 px-4 py-2">{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="border border-gray-200 px-4 py-2 text-center">
                No pending orders available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;
