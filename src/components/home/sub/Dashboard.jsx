import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../../../api/axios';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [chartData, setChartData] = useState({});
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filter, setFilter] = useState('7days');

  useEffect(() => {
    api.get('api/orders')
      .then((res) => {
        const data = res.data;
        setOrders(data);
        setFilteredOrders(data); // Default data
        updateChart(data, '7days'); // Initial filter
      })
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  const updateChart = (data, range) => {
    let filtered = [];
    const today = new Date();
    let last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    let lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    let lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    // Filtering data based on selected range
    if (range === '7days') {
      filtered = data.filter((order) => new Date(order.dateOfOrder) >= last7Days);
    } else if (range === '1month') {
      filtered = data.filter((order) => new Date(order.dateOfOrder) >= lastMonth);
    } else if (range === '1year') {
      filtered = data.filter((order) => new Date(order.dateOfOrder) >= lastYear);
    } else if (range === 'custom') {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      filtered = data.filter(
        (order) => new Date(order.dateOfOrder) >= from && new Date(order.dateOfOrder) <= to
      );
    }

    setFilteredOrders(filtered);

    let labels = [];
    let dataPoints = [];

    if (range === '1year') {
      // Aggregating by month for the '1year' filter
      const monthlyData = Array(12).fill(0); // Array to store counts for each month (Jan to Dec)

      filtered.forEach((order) => {
        const orderDate = new Date(order.dateOfOrder);
        const month = orderDate.getMonth(); // Get month index (0 = January, 11 = December)
        monthlyData[month] += 1; // Increment the count for that month
      });

      labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      dataPoints = monthlyData;
    } else {
      // Aggregating by date for other filters (7days, 1month, custom)
      labels = [
        ...new Set(
          filtered.map((order) =>
            new Date(order.dateOfOrder).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          )
        ),
      ];

      dataPoints = labels.map(
        (label) =>
          filtered.filter(
            (order) =>
              new Date(order.dateOfOrder).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }) === label
          ).length
      );
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Orders',
          data: dataPoints,
          backgroundColor: '#4A90E2',
          borderRadius: 4,
        },
      ],
    });
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    updateChart(orders, value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const applyCustomDateFilter = () => {
    if (dateRange.from && dateRange.to) {
      updateChart(orders, 'custom');
    } else {
      alert('Please select both "From" and "To" dates.');
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Order Dashboard</h1>
      <div className="flex justify-center gap-6 mb-8">
        <select
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="1year">Last 1 Year</option>
        </select>
        <div className="flex items-center gap-4">
          <input
            type="date"
            name="from"
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
            onChange={handleDateChange}
          />
          <input
            type="date"
            name="to"
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
            onChange={handleDateChange}
          />
          <button
            onClick={applyCustomDateFilter}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {chartData.labels && chartData.labels.length > 0 ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Orders Overview', font: { size: 18 } },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: { size: 14 },
                    color: '#4A90E2',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Orders Count',
                    font: { size: 14 },
                    color: '#4A90E2',
                  },
                },
              },
            }}
            height={400}
          />
        ) : (
          <p className="text-center text-gray-600">No data available for the selected range.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
