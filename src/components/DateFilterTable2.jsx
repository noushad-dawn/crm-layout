import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons
import config from './config';

const DateFilterTable = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [sampleData, setSampleData] = useState([]); // Store fetched data
  const [searchQuery, setSearchQuery] = useState(''); // Store search term
  const [filteredData, setFilteredData] = useState([]); // Store filtered data

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // UseEffect to fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseURL}/api/orders`); // Replace with your backend API endpoint
        const data = await response.json();
        setSampleData(data); // Store the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to filter data by date range
  const filterByDate = (data) => {
    const endDate = toDate ? toDate : getCurrentDate(); // Use current date if no To Date is selected
    if (!fromDate) return data; // If no "From Date", don't filter by date
    return data.filter(
      (item) => item.dateOfOrder >= fromDate && item.dateOfOrder <= endDate
    );
  };

  // Function to filter data by search query (Name, Order ID, or Phone Number)
  const filterBySearchQuery = (data) => {
    if (!searchQuery) return data; // If no search query, don't filter by search
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.orderId.includes(searchQuery) ||
        item.phoneNumber.includes(searchQuery)
    );
  };

  // Combine both filters (Date range and Search query)
  const filterData = () => {
    let filtered = filterByDate(sampleData);
    filtered = filterBySearchQuery(filtered);
    setFilteredData(filtered);
    setShowTable(true);
  };

  // Function to handle search when search icon is clicked
  const handleSearch = () => {
    filterData();
  };

  // Function to handle button click to show table
  const handleShowData = () => {
    setShowTable(true);
    filterData();
  };

  return (
    <div className="container mx-auto p-4 mt-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Search Order</h2>
      <div className="mt-4 mb-4">
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
      <div className="mb-4 flex items-center">
        <label className="block mb-2"></label>
        <div className="flex items-center border p-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name, Order ID, or Phone Number"
            className="border-none outline-none"
          />
          <FaSearch
            onClick={handleSearch}
            className="cursor-pointer ml-2"
          />
        </div>
      </div>

      {/* Show Data Button for filtering by date */}
      {fromDate && (
        <button
          onClick={handleShowData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Show Data
        </button>
      )}

      {showTable && (
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] mt-4">
        <table className="table-auto w-full min-w-max">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Phone Number</th>
              <th className="px-4 py-2 border">Products</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Units</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Payment Status</th>
              <th className="px-4 py-2 border">Date of Order</th>
              <th className="px-4 py-2 border">Date of Delivery</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.orderId}>
                <td className="border px-4 py-2">{item.orderId}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.userID}</td>
                <td className="border px-4 py-2">{item.phoneNumber}</td>
                <td className="border px-4 py-2">{item.products}</td>
                <td className="border px-4 py-2">${item.totalPrice.toFixed(2)}</td>
                <td className="border px-4 py-2">{item.units}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.paymentStatus}</td>
                <td className="border px-4 py-2">{item.dateOfOrder}</td>
                <td className="border px-4 py-2">{item.dateOfDelivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
};

export default DateFilterTable;
