import React, { useState } from "react";

const MoreDetails = ({ orders, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Existing Orders</h3>
      <input
        type="text"
        placeholder="Search by Name or Order ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 w-1/5"
      />
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Units</th>
                <th className="border border-gray-300 p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">
                      {order.orderId}
                    </td>
                    <td className="border border-gray-300 p-2">{order.name}</td>
                    <td className="border border-gray-300 p-2">
                      {order.category}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.units}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-300 p-2 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MoreDetails;
