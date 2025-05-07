//noushad.......
//noushad.......
//noushad.......
//noushad.......
//noushad.......

import React, { useState, useEffect } from 'react';
import api from 'api'; // Make sure to install api if you haven't
import config from '../config';

const ProcessTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from the backend on component mount
  useEffect(() => {

      fetchData();
    
  }, []); 
  
  const calculateTAT = (dateOfDelivery) => {
    const currentDate = new Date();
    const deliveryDate = new Date(dateOfDelivery);

    const timeDifference = deliveryDate - currentDate;

    if (timeDifference < 0) {
      return 0;
    }

    const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
    return hoursLeft;
  };

  const formatTAT = (hoursLeft) => {
    if (hoursLeft === 0) {
      return "0 hrs"; // Delivery date has passed
    }
    if (hoursLeft > 72) {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${daysLeft} days`;
    } else {
      return `${hoursLeft} hrs`;
    }
  };

  const getTATClass = (hoursLeft) => {
    // const hoursLeft = daysLeft * 24;
    if (hoursLeft <= 24) return "text-red-600 font-bold";
    if (hoursLeft <= 48) return "text-yellow-600 font-bold";
    if (hoursLeft <= 72) return "text-green-600 font-bold";
    return "text-gray-800";
  };

  
  const fetchData = async () => {
    try {
      const response = await api.get(`api/orders/process/Pending`); // Update URL to your endpoint
      setFilteredData(response.data||[]);
    } catch (error) {
      setError('No orders found for this status');
    }
  };
  // Handle status selection
  const readytobeDelivered = async (orderId, status, userID) =>{
    if(status === 'Order to be Delivered'){
      alert('Already Added into the Ready to be Delivered');
      return ;
    }
    try {
      await api.patch(`api/orders/orderId/${orderId}`, {
        status: 'Ready to be Delivered',
      });
      alert('Order Added to Ready to be Delivered');
      fetchData()
      // processAssign(orderId, userID);
    } catch (error) {
      alert('Error Occured!!')
      console.log(error);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Process Table</h2>

      {/* Data Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Order ID</th>
            <th className="border border-gray-200 px-4 py-2">Username</th>
            <th className="border border-gray-200 px-4 py-2">User ID</th>
            <th className="border border-gray-200 px-4 py-2">Category</th>
            <th className="border border-gray-200 px-4 py-2">TAT</th>
            <th className="border border-gray-200 px-4 py-2">Product</th>
            <th className="border border-gray-200 px-4 py-2">Location</th>
            <th className="border border-gray-200 px-4 py-2">Date of Order</th>
            <th className="border border-gray-200 px-4 py-2">Date of Delivery</th>
            <th className="border border-gray-200 px-4 py-2">Price</th>
            <th className="border border-gray-200 px-4 py-2">Unit</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
            <th className="border border-gray-200 px-4 py-2">Ready To be Delivered</th>
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
            filteredData.map((item, index) => {
              const daysLeft = calculateTAT(item.dateOfDelivery);
              const tatClass = getTATClass(daysLeft);
              const tatDisplay = formatTAT(daysLeft);
              return(
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2">{item.orderId}</td>
                <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                <td className="border border-gray-200 px-4 py-2">{item.userID}</td>
                <td className="border border-gray-200 px-4 py-2">{item.category}</td>
                <td className={`border border-gray-200 px-4 py-2 ${tatClass}`}>{tatDisplay}</td>
                <td className="border border-gray-200 px-4 py-2">{item.products}</td>
                <td className="border border-gray-200 px-4 py-2">{item.location}</td>
                <td className="border border-gray-200 px-4 py-2">{new Date(item.dateOfOrder).toISOString().split('T')[0]}</td>
                <td className="border border-gray-200 px-4 py-2">{new Date(item.dateOfDelivery).toISOString().split('T')[0]}</td>
                <td className="border border-gray-200 px-4 py-2">₹{item.totalPrice.toFixed(2)}</td>
                <td className="border border-gray-200 px-4 py-2">{item.units}</td>
                <td className="border border-gray-200 px-4 py-2">{item.status}</td>
                <td className="flex justify-center py-2 px-4 border-b">
                <button
                  onClick={() => readytobeDelivered(item.orderId, item.status, item.userID)}
                  className={`px-4 py-2 rounded text-white ${
                    item.status!=='Pending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={item.status==='Ready to be Delivered'}
                >
                  {item.status==='Pending' ? 'Add' : 'Added'}
                </button>
              </td>
              </tr>
            )})
          ) : (
            <tr>
              <td colSpan="8" className="border border-gray-200 px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;
