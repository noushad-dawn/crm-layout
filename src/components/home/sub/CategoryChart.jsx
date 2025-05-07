import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import api from "../../../api/axios";

// Registering necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryChart = () => {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [chartData, setChartData] = useState({});
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [filter, setFilter] = useState("7days"); // Default filter
  const [categoryCounts, setCategoryCounts] = useState({}); // Store category counts
  const [categoryColors, setCategoryColors] = useState([]); // Store category colors

  useEffect(() => {
    // Fetch orders data
    api
      .get("api/orders")
      .then((res) => {
        const data = res.data;
        setOrders(data);
        setFilteredOrders(data); // Set the initial filtered orders
        updateChart(data, "7days"); // Apply the '7days' filter on initial load
      })
      .catch((err) => console.error("Error fetching orders:", err));

    // Fetch categories
    api
      .get("api/services/names")
      .then((res) => {
        const data = res.data;
        setCategories(data);
      })
      .catch((err) => {console.error("Error fetching categories:", err) 
        setCategories([]);
      });
  }, []);

  // Aggregate the orders by category and count occurrences
  const aggregateCategories = (data) => {
    const categoryCount = {};

    data.forEach((order) => {
      if (order.category && order.category.length > 0) {
        order.category.forEach((category) => {
          // Match category names exactly or use a helper method if needed
          if (categories.some((cat) => cat.serviceName === category)) {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          }
        });
      }
    });
    return categoryCount;
  };

  const updateChart = (data, range) => {
    let filtered = [];
    const today = new Date();
    let last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    let lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    let lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    // Filter orders based on the selected range
    if (range === "7days") {
      filtered = data.filter(
        (order) => new Date(order.dateOfOrder) >= last7Days
      );
    } else if (range === "1month") {
      filtered = data.filter(
        (order) => new Date(order.dateOfOrder) >= lastMonth
      );
    } else if (range === "1year") {
      filtered = data.filter(
        (order) => new Date(order.dateOfOrder) >= lastYear
      );
    } else if (range === "custom") {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      filtered = data.filter(
        (order) =>
          new Date(order.dateOfOrder) >= from &&
          new Date(order.dateOfOrder) <= to
      );
    }

    setFilteredOrders(filtered); // Set filtered orders

    // Aggregate category counts for the filtered orders
    const aggregatedData = aggregateCategories(filtered);
    setCategoryCounts(aggregatedData);

    const labels = categories.length
      ? categories.map((cat) => cat.serviceName)
      : Object.keys(aggregatedData); // Ensure labels are taken from categories or aggregated data keys
    const dataPoints = labels.map((category) => aggregatedData[category] || 0); // Ensure data points are mapped correctly

    // Set chart colors for each category
    const chartColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#FF5733",
      "#8E44AD",
      "#2ECC71",
      "#E74C3C",
      "#F39C12",
      "#1ABC9C",
      "#9B59B6",
      "#34495E",
      "#D35400",
      "#16A085",
      "#F1C40F",
      "#C0392B",
    ];

    setCategoryColors(chartColors.slice(0, labels.length)); // Map colors to the number of categories

    setChartData({
      labels,
      datasets: [
        {
          data: dataPoints,
          backgroundColor: chartColors.slice(0, labels.length), // Use colors for chart
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
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const applyCustomDateFilter = () => {
    if (dateRange.from && dateRange.to) {
      updateChart(orders, "custom");
    } else {
      alert('Please select both "From" and "To" dates.');
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      updateChart(orders, filter); // Trigger the update when orders are loaded and filter is set
    }
  }, [orders, filter]);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">
        Orders by Category
      </h1>

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

      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-full">
        {chartData?.labels?.length > 0 ? (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    font: {
                      size: 16,
                    },
                  },
                },
                title: {
                  display: true,
                  text: "Order Distribution by Category",
                  font: {
                    size: 20,
                  },
                },
              },
            }}
            height={600}
            width={1000}
          />
        ) : (
          <p className="text-center text-gray-600">
            No data available for the selected range.
          </p>
        )}
      </div>

      {/* Category Counts Below the Chart */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 w-full max-w-full">
        {Object.keys(categoryCounts).map((category, index) => (
          <div
            key={category}
            className="p-6 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl"
            style={{
              background: `linear-gradient(to right, ${
                categoryColors[index] || "#FF6384"
              }, ${categoryColors[index] || "#FF6384"})`,
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              {category}
            </h2>
            <p className="text-3xl font-bold text-white">
              {categoryCounts[category]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
