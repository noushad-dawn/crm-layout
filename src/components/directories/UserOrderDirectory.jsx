import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import config from '../config';

const UserOrderDirectory = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [orders, setOrders] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState({});
  // Fetching users from the backend

  const openNoteModal = (orderId) => {
    fetchNotes(orderId);
    setIsNoteModalOpen(true);
  };

  const fetchNotes = async (orderId) => {
    try {
      const response = await api.get(`api/note/${orderId}`);
      setNotes(Array.isArray(response.data) ? response.data : []); // Ensure the data is an array
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };
  useEffect(() => {
    api.get(`api/users`)
      .then(res => setUsers(res.data.filter(user=>user.role!=='driver')))
      .catch(err => console.error(err));
  }, []);

  // Fetch user orders when a user is selected
  useEffect(() => {
    if (selectedUser) {
      api.get(`api/userDirectories/userHistory/${selectedUser}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedUser]);

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold mb-4">User Order Directory</h1>

      {/* User Dropdown */}
      <label htmlFor="userDropdown" className="block text-lg font-medium text-gray-700 mb-2">Select User:</label>
      <select
        id="userDropdown"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4"
      >
        <option value="">Select a User</option>
        {users.map(user => (
          <option key={user.userID} value={user.userID}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Orders Table */}
      {selectedUser && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Orders Assigned to {users.find(u => u.userID === selectedUser)?.name}:</h2>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Products</th>
                <th className="py-2 px-4">Units</th>
                <th className="py-2 px-4">Customer Name</th>
                <th className="py-2 px-4">Process Name</th>
                <th className="py-2 px-4">Notes</th>
                <th className="py-2 px-4">Assign Date</th>
                <th className="py-2 px-4">Detach Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.userID} className="text-center border-b">
                  <td className="py-2 px-4">{order.userID}</td>
                  <td className="py-2 px-4">{order.name}</td>
                  <td className="py-2 px-4">{order.orderId.orderId}</td>
                  <td className="py-2 px-4">{order.orderId.category.join(', ')}</td>
                  <td className="py-2 px-4">{order.orderId.products.join(', ')}</td>
                  <td className="py-2 px-4">{order.orderId.units.reduce((unit,acc)=> unit+acc)}</td>
                  <td className="py-2 px-4">{order.orderId.name}</td>
                  <td className="py-2 px-4">{order.process}</td>
                  <td className="py-2 px-4">
                    <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => openNoteModal(order.orderId._id)} // Pass the entire order object
                  >
                    View Notes
                  </button></td>

                  <td className="py-2 px-4">{new Date(order.assignedAt).toLocaleString()}</td>
                  <td className="py-2 px-4">{new Date(order.detachedAt).toLocaleString()}</td>
                  
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="py-4 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
            <h3 className="text-xl font-semibold mb-4">Notes for Order</h3>

            {/* Display existing notes */}
            <div className="mb-4 max-h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-start justify-between mb-4 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <div className="flex flex-col space-y-1 w-full">
                      <span className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleString()}:
                      </span>
                      <p className="text-lg text-gray-700 font-medium">
                        {note.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        By: {note.createdBy?.name || "Unknown"}
                      </p>
                    </div>
                    {/* <button
                      // onClick={() => handleDelete(note._id)} // You'll need to define this function
                      className="text-red-500 hover:text-red-700 focus:outline-none font-semibold"
                    >
                      Delete
                    </button> */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No notes available for this order.
                </p>
              )}
            </div>
            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute top-3 right-3 text-red-400 hover:text-gray-600 focus:outline-none text-3xl"
              aria-label="Close"
            >
              &times;
            </button>
            {/* <button onClick={setIsNoteModalOpen(false)}>close</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDirectory;
