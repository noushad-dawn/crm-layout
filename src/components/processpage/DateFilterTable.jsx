import axios from 'axios';
import React, { useState, useEffect } from 'react';
import config from '../config';

const DateFilterTable = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]); // Store fetched data

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`${config.baseURL}/api/orders`); // Replace with your actual API URL
        setData(response.data); // Store the data from backend
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData(); // Fetch data on component mount
  }, []);

  const filterData = () => {
    const endDate = toDate ? toDate : getCurrentDate(); // Use current date if no To Date is selected
    return data.filter((item) => item.dateOfDelivery >= fromDate && item.dateOfDelivery <= endDate);
  };

  const handleShowData = () => {
    setShowTable(true); // Show the table when the button is clicked
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Search Order</h2>

      <div className="mb-4">
        <label className="block mb-2">From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 mb-4"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 mb-4"
        />
      </div>

      {/* Conditionally render the "Show Data" button only if the "From Date" is selected */}
      {fromDate && (
        <button
          onClick={handleShowData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Show Data
        </button>
      )}

      {showTable && (
        <table className="mt-4 table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Products</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Units</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filterData().map((item) => (
              <tr key={item.orderId}>
                <td className="border px-4 py-2">{item.orderId}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.userID}</td>
                <td className="border px-4 py-2">{item.products}</td>
                <td className="border px-4 py-2">${item.totalPrice.toFixed(2)}</td>
                <td className="border px-4 py-2">{item.units}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2">{item.dateOfDelivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DateFilterTable;
