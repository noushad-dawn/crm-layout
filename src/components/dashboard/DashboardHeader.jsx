import React, { useState, useEffect } from 'react';
import config from '../config';
// import 'tailwindcss/tailwind.css';

const DashboardHeader = () => {
  const [ordersStats, setOrdersStats] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    onRoute: 0,
    readyToDeliver: 0,
  });

  useEffect(() => {
    // Fetch orders data for the current month
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${config.baseURL}/api/orders`);
        const data = await res.json();

        // Filter orders for the current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthOrders = data.filter((order) => {
          const orderDate = new Date(order.dateOfOrder);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        // Aggregate order stats
        const aggregatedStats = {
          totalOrders: currentMonthOrders.length,
          pending: currentMonthOrders.filter(order => order.status === 'Pending').length,
          delivered: currentMonthOrders.filter(order => order.status === 'Delivered').length,
          onRoute: currentMonthOrders.filter(order => order.status === 'On Route').length,
          readyToDeliver: currentMonthOrders.filter(order => order.status === 'Ready to Deliver').length,
        };

        setOrdersStats(aggregatedStats);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 pt-20">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-full">
        {/* Total Orders */}
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-white">{ordersStats.totalOrders}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-2">Pending</h2>
          <p className="text-3xl font-bold text-white">{ordersStats.pending}</p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-2">Delivered</h2>
          <p className="text-3xl font-bold text-white">{ordersStats.delivered}</p>
        </div>

        {/* On Route Orders */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-2">On Route</h2>
          <p className="text-3xl font-bold text-white">{ordersStats.onRoute}</p>
        </div>

        {/* Ready to be Delivered Orders */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-2">Ready to Deliver</h2>
          <p className="text-3xl font-bold text-white">{ordersStats.readyToDeliver}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
