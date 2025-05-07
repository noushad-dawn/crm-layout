import React, { useEffect, useState } from "react";
import api from '../../api/axios';

import config from "../config";

const IronUnitDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState("");
  const [ironUnitDetails, setIronUnitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users. Please try again.");
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch iron unit details based on selected user ID
  const fetchIronUnitDetails = async (userID) => {
    if (!userID) return;

    setLoading(true);
    try {
      const response = await api.get(`api/iron-unit/${userID}`);
      setIronUnitDetails(response.data.ironUnit);
    } catch (error) {
      setIronUnitDetails(null);  // Ensure it's null if there's an error
      console.error("Error fetching iron unit details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Iron Unit Details
        </h1>

        {/* Dropdown for User Selection */}
        <div className="flex items-center gap-4 mb-6">
          {dropdownLoading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : (
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedUserID}
              onChange={(e) => {
                setSelectedUserID(e.target.value);
                fetchIronUnitDetails(e.target.value);
              }}
            >
              <option value="" disabled>
                Select a User
              </option>
              {users.map((user) => (
                <option key={user.userID} value={user._id}>
                  {user.name} ({user.phoneNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Iron Unit Details */}
        {loading ? (
          <p className="text-gray-600">Loading details...</p>
        ) : (
          ironUnitDetails ? (
            <>
              {/* User Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold text-blue-800">
                  User Information
                </h2>
                <p className="text-gray-600">
                  <strong>Name:</strong> {ironUnitDetails.userID?.name}
                </p>
                <p className="text-gray-600">
                  <strong>Phone Number:</strong> {ironUnitDetails.userID?.phoneNumber}
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> {ironUnitDetails.userID?.address}
                </p>
                <p className="text-gray-600">
                  <strong>Total Units:</strong> {ironUnitDetails.totalUnits}
                </p>
              </div>

              {/* Order Details */}
              {ironUnitDetails.orderUnits.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="px-4 py-2 border">Order ID</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">Units</th>
                      <th className="px-4 py-2 border">Total Price</th>
                      <th className="px-4 py-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ironUnitDetails.orderUnits.map((order, index) => (
                      <tr
                        key={order.orderId._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 border text-gray-700">
                          {order.orderId.orderId}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {order.orderId.category.join(", ")}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {order.units}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {order.orderId.totalPrice}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {order.orderId.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">
                  No orders found for this user.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600">No iron unit details available for this user.</p>
          )
        )}
      </div>
    </div>
  );
};

export default IronUnitDetails;
