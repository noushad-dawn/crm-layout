import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const TatTable = () => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    timeRange: "",
    deliveryStatus: "",
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();

      // Add filters to params if they exist
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.paymentStatus)
        params.append("paymentStatus", filters.paymentStatus);
      if (filters.timeRange) params.append("timeRange", filters.timeRange);
      if (filters.deliveryStatus)
        params.append("deliveryStatus", filters.deliveryStatus);

      const response = await axios.get(
        `${config.baseURL}/api/orders/tat?${params.toString()}`
      );
      setOrders(response.data);
      setVisibleOrders(response.data.slice(0, itemsPerPage));
      setPage(1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextItems = orders.slice(0, nextPage * itemsPerPage);
    setVisibleOrders(nextItems);
    setPage(nextPage);
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const calculateTAT = (dateOfDelivery) => {
    const currentDate = new Date();
    const deliveryDate = new Date(dateOfDelivery);
    const timeDifference = deliveryDate - currentDate;
    return timeDifference < 0
      ? 0
      : Math.ceil(timeDifference / (1000 * 60 * 60)); // In hours
  };

  const formatTAT = (hoursLeft) => {
    if (hoursLeft === 0) return "0 hrs";
    if (hoursLeft > 72) return `${Math.floor(hoursLeft / 24)} days`;
    return `${hoursLeft} hrs`;
  };

  const getTATClass = (hoursLeft) => {
    if (hoursLeft <= 24) return "text-red-600 font-bold";
    if (hoursLeft <= 48) return "text-yellow-600 font-bold";
    if (hoursLeft <= 72) return "text-green-600 font-bold";
    return "text-gray-800";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusUpdate = async (orderId, delivery) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark Order ID ${orderId} as Delivered and Payment Completed?`
    );

    if (confirmAction) {
      try {
        if (delivery) {
          await axios.patch(`${config.baseURL}/api/orders/orderId/${orderId}`, {
            status: "Delivered",
          });
        }
        await axios.post(
          `${config.baseURL}/api/orders/updatePaymentStatus/${orderId}`,
          { paymentStatus: "Completed" }
        );

        alert(`Order ID ${orderId} has been updated successfully.`);
        fetchOrders(); // Refresh orders
      } catch (err) {
        console.error("Error updating statuses:", err);
        alert("An error occurred while updating the statuses.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">TAT Table</h2>
      <div className="py-5 flex flex-wrap gap-4"> 
        <input
          type="text"
          name="search"
          placeholder="Search by Order ID, Name or Phone"
          className="p-2 border rounded"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          className="p-2 border rounded"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Ready to be Delivered">Ready to be delivered</option>
          <option value="On route">On route</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select
          className="p-2 border rounded"
          name="paymentStatus"
          value={filters.paymentStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Payment Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
        <select
          className="p-2 border rounded"
          name="timeRange"
          value={filters.timeRange}
          onChange={handleFilterChange}
        >
          <option value="">All TAT</option>
          <option value="0">0 hr</option>
          <option value="0-24">0-24 hrs</option>
          <option value="24-48">24-48 hrs</option>
          <option value="0-48">0-48 hrs</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          className="p-2 border rounded"
          name="deliveryStatus"
          value={filters.deliveryStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Delivery</option>
          <option value="true">Delivery True</option>
          <option value="false">Delivery False</option>
        </select>
        <button
          onClick={() =>
            setFilters({
              search: "",
              status: "",
              paymentStatus: "",
              timeRange: "",
              deliveryStatus: "",
            })
          }
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
      <div className="shadow-lg">
        <div className="relative overflow-x-auto">
          <table className="min-w-full table-fixed bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border border-gray-300 text-gray-800">
                  Order ID
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Name
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Phone
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Date of Order
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Amount
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  TAT Report
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Delivery Date
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Status
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Payment
                </th>
                <th className="p-2 border border-gray-300 text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {visibleOrders && visibleOrders.length > 0 ? (
                visibleOrders.map((order) => {
                  const hoursLeft = calculateTAT(order.dateOfDelivery);
                  const tatClass = getTATClass(hoursLeft);
                  const tatDisplay = formatTAT(hoursLeft);
                  return (
                    <tr className="hover:bg-gray-100" key={order.orderId}>
                      <td className={`${tatClass} p-2 border border-gray-300`}>
                        {order.orderId}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.name}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.phoneNumber}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {new Date(order.dateOfOrder).toLocaleDateString()}
                      </td>
                      <td className="p-2 border border-gray-300">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className={`${tatClass} p-2 border border-gray-300`}>
                        {tatDisplay}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {new Date(order.dateOfDelivery).toLocaleDateString()}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.status}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.paymentStatus}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                          onClick={() =>
                            handleStatusUpdate(order.orderId, order.delivery)
                          }
                          disabled={
                            order.status === "Delivered" &&
                            order.paymentStatus === "Completed"
                          }
                        >
                          {order.status === "Delivered" &&
                          order.paymentStatus === "Completed"
                            ? "Completed"
                            : "Mark Complete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              )}   */}
              {Array.isArray(visibleOrders) && visibleOrders.length > 0 ? (
                visibleOrders.map((order) => {
                  const hoursLeft = calculateTAT(order.dateOfDelivery);
                  const tatClass = getTATClass(hoursLeft);
                  const tatDisplay = formatTAT(hoursLeft);
                  return (
                    <tr className="hover:bg-gray-100" key={order.orderId}>
                      <td className={`${tatClass} p-2 border border-gray-300`}>
                        {order.orderId}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.name}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.phoneNumber}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {new Date(order.dateOfOrder).toLocaleDateString()}
                      </td>
                      <td className="p-2 border border-gray-300">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className={`${tatClass} p-2 border border-gray-300`}>
                        {tatDisplay}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {new Date(order.dateOfDelivery).toLocaleDateString()}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.status}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {order.paymentStatus}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                          onClick={() =>
                            handleStatusUpdate(order.orderId, order.delivery)
                          }
                          disabled={
                            order.status === "Delivered" &&
                            order.paymentStatus === "Completed"
                          }
                        >
                          {order.status === "Delivered" &&
                          order.paymentStatus === "Completed"
                            ? "Completed"
                            : "Mark Complete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {orders.length > visibleOrders.length && (
            <div className="text-center mt-4">
              <button
                onClick={loadMoreData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Show More ({orders.length - visibleOrders.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TatTable;
