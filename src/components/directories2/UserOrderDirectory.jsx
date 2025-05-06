// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../config';
// import InfiniteScroll from 'react-infinite-scroll-component';

// const UserOrderDirectory = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [orders, setOrders] = useState([]);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [notes, setNotes] = useState({});
//   const [visibleOrders, setVisibleOrders] = useState([]); // Orders currently visible
//   const [hasMore, setHasMore] = useState(true); // Whether there are more orders to load
//   const [page, setPage] = useState(0); // Current page for pagination
//   const pageSize = 10; // Number of orders to load per page

//   // Fetching users from the backend
//   useEffect(() => {
//     axios.get(`${config.baseURL}/api/users`)
//       .then(res => setUsers(res.data.filter(user => user.role !== 'driver')))
//       .catch(err => console.error(err));
//   }, []);

//   // Fetch user orders when a user is selected
//   useEffect(() => {
//     if (selectedUser) {
//       axios.get(`${config.baseURL}/api/userDirectories/userHistory/${selectedUser}`)
//         .then(res => {
//           setOrders(res.data);
//           setVisibleOrders(res.data.slice(0, pageSize)); // Load initial set of orders
//           setHasMore(res.data.length > pageSize); // Set hasMore based on total orders
//         })
//         .catch(err => console.error(err));
//     }
//   }, [selectedUser]);

//   // Load more orders for infinite scroll
//   const loadMoreOrders = () => {
//     const nextPage = page + 1;
//     const nextOrders = orders.slice(
//       nextPage * pageSize,
//       (nextPage + 1) * pageSize
//     );

//     if (nextOrders.length === 0) {
//       setHasMore(false); // No more orders to load
//       return;
//     }

//     setVisibleOrders((prev) => [...prev, ...nextOrders]);
//     setPage(nextPage);
//   };

//   const openNoteModal = (orderId) => {
//     fetchNotes(orderId);
//     setIsNoteModalOpen(true);
//   };

//   const fetchNotes = async (orderId) => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/note/${orderId}`);
//       setNotes(Array.isArray(response.data) ? response.data : []); // Ensure the data is an array
//     } catch (error) {
//       console.error("Error fetching notes", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 mt-12">
//       <h1 className="text-2xl font-bold mb-4">User Order Directory</h1>

//       {/* User Dropdown */}
//       <label htmlFor="userDropdown" className="block text-lg font-medium text-gray-700 mb-2">Select User:</label>
//       <select
//         id="userDropdown"
//         value={selectedUser}
//         onChange={(e) => setSelectedUser(e.target.value)}
//         className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4"
//       >
//         <option value="">Select a User</option>
//         {users.map(user => (
//           <option key={user.userID} value={user.userID}>
//             {user.name}
//           </option>
//         ))}
//       </select>

//       {/* Orders Table */}
//       {selectedUser && (
//         <div id="scrollableDiv" className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg">
//           <InfiniteScroll
//             dataLength={visibleOrders.length}
//             next={loadMoreOrders}
//             hasMore={hasMore}
//             loader={
//               <div className="text-center p-4 text-gray-500">
//                 Loading more orders...
//               </div>
//             }
//             scrollableTarget="scrollableDiv"
//           >
//             <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-800 text-white">
//                   <th className="py-2 px-4">User ID</th>
//                   <th className="py-2 px-4">User Name</th>
//                   <th className="py-2 px-4">Order ID</th>
//                   <th className="py-2 px-4">Category</th>
//                   <th className="py-2 px-4">Products</th>
//                   <th className="py-2 px-4">Units</th>
//                   <th className="py-2 px-4">Customer Name</th>
//                   <th className="py-2 px-4">Process Name</th>
//                   <th className="py-2 px-4">Notes</th>
//                   <th className="py-2 px-4">Assign Date</th>
//                   <th className="py-2 px-4">Detach Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleOrders.length > 0 ? visibleOrders.map(order => (
//                   <tr key={order.userID} className="text-center border-b">
//                     <td className="py-2 px-4">{order.userID}</td>
//                     <td className="py-2 px-4">{order.name}</td>
//                     <td className="py-2 px-4">{order.orderId.orderId}</td>
//                     <td className="py-2 px-4">{order.orderId.category.join(', ')}</td>
//                     <td className="py-2 px-4">{order.orderId.products.join(', ')}</td>
//                     <td className="py-2 px-4">{order.orderId.units.reduce((unit, acc) => unit + acc)}</td>
//                     <td className="py-2 px-4">{order.orderId.name}</td>
//                     <td className="py-2 px-4">{order.process}</td>
//                     <td className="py-2 px-4">
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded"
//                         onClick={() => openNoteModal(order.orderId._id)} // Pass the entire order object
//                       >
//                         View Notes
//                       </button>
//                     </td>
//                     <td className="py-2 px-4">{new Date(order.assignedAt).toLocaleString()}</td>
//                     <td className="py-2 px-4">{new Date(order.detachedAt).toLocaleString()}</td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan="10" className="py-4 text-center text-gray-500">No orders found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </InfiniteScroll>
//         </div>
//       )}

//       {isNoteModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
//             <h3 className="text-xl font-semibold mb-4">Notes for Order</h3>

//             {/* Display existing notes */}
//             <div className="mb-4 max-h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md">
//               {notes.length > 0 ? (
//                 notes.map((note) => (
//                   <div
//                     key={note._id}
//                     className="flex items-start justify-between mb-4 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
//                   >
//                     <div className="flex flex-col space-y-1 w-full">
//                       <span className="text-sm text-gray-500">
//                         {new Date(note.createdAt).toLocaleString()}:
//                       </span>
//                       <p className="text-lg text-gray-700 font-medium">
//                         {note.content}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         By: {note.createdBy?.name || "Unknown"}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">
//                   No notes available for this order.
//                 </p>
//               )}
//             </div>
//             <button
//               onClick={() => setIsNoteModalOpen(false)}
//               className="absolute top-3 right-3 text-red-400 hover:text-gray-600 focus:outline-none text-3xl"
//               aria-label="Close"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserOrderDirectory;
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import InfiniteScroll from "react-infinite-scroll-component";

const UserOrderDirectory = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [orders, setOrders] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Reset scroll state when user changes
  const resetScrollState = () => {
    setPage(0);
    setVisibleOrders([]);
    setHasMore(true);
  };

  // Fetching users from the backend
  // useEffect(() => {
  //   axios.get(`${config.baseURL}/api/users`)
  //     .then(res => setUsers(res.data.filter(user => user.role !== 'driver')))
  //     .catch(err => console.error(err));
  // }, []);

  useEffect(() => {
    axios
      .get(`${config.baseURL}/api/users`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUsers(res.data.filter((user) => user.role !== "driver"));
        } else {
          console.error("Expected an array but got:", res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch user orders when a user is selected
  useEffect(() => {
    if (selectedUser) {
      resetScrollState();
      axios
        .get(
          `${config.baseURL}/api/userDirectories/userHistory/${selectedUser}`
        )
        .then((res) => {
          setOrders(res.data);
          // Load initial set of orders
          const initialOrders = res.data.slice(0, pageSize);
          setVisibleOrders(initialOrders);
          setHasMore(res.data.length > initialOrders.length);
        })
        .catch((err) => console.error(err));
    } else {
      resetScrollState();
      setOrders([]);
    }
  }, [selectedUser]);

  // Load more orders for infinite scroll
  const loadMoreOrders = () => {
    const nextPage = page + 1;
    const nextOrders = orders.slice(
      nextPage * pageSize,
      (nextPage + 1) * pageSize
    );

    if (nextOrders.length === 0) {
      setHasMore(false);
      return;
    }

    setVisibleOrders((prev) => [...prev, ...nextOrders]);
    setPage(nextPage);
  };

  const openNoteModal = async (orderId) => {
    try {
      const response = await axios.get(`${config.baseURL}/api/note/${orderId}`);
      setNotes(Array.isArray(response.data) ? response.data : []);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.error("Error fetching notes", error);
      setNotes([]);
      setIsNoteModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold mb-4">User Order Directory</h1>

      {/* User Dropdown */}
      <label
        htmlFor="userDropdown"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Select User:
      </label>
      <select
        id="userDropdown"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4"
      >
        <option value="">Select a User</option>
        {users.map((user) => (
          <option key={user.userID} value={user.userID}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Orders Table */}
      {selectedUser && (
        <div
          id="scrollableDiv"
          className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg"
        >
          <InfiniteScroll
            dataLength={visibleOrders.length}
            next={loadMoreOrders}
            hasMore={hasMore && visibleOrders.length < orders.length}
            loader={
              visibleOrders.length > 0 && (
                <div className="text-center p-4 text-gray-500">
                  Loading more orders...
                </div>
              )
            }
            scrollableTarget="scrollableDiv"
            key={selectedUser} // This forces re-render when user changes
          >
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
                {visibleOrders.length > 0 ? (
                  visibleOrders.map((order) => (
                    <tr
                      key={`${order.userID}-${order.orderId.orderId}`}
                      className="text-center border-b"
                    >
                      <td className="py-2 px-4">{order.userID}</td>
                      <td className="py-2 px-4">{order.name}</td>
                      <td className="py-2 px-4">{order.orderId.orderId}</td>
                      <td className="py-2 px-4">
                        {order.orderId.category.join(", ")}
                      </td>
                      <td className="py-2 px-4">
                        {order.orderId.products.join(", ")}
                      </td>
                      <td className="py-2 px-4">
                        {order.orderId.units.reduce(
                          (acc, unit) => acc + unit,
                          0
                        )}
                      </td>
                      <td className="py-2 px-4">{order.orderId.name}</td>
                      <td className="py-2 px-4">{order.process}</td>
                      <td className="py-2 px-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => openNoteModal(order.orderId._id)}
                        >
                          View Notes
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(order.assignedAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4">
                        {order.detachedAt
                          ? new Date(order.detachedAt).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="py-4 text-center text-gray-500">
                      {orders.length === 0
                        ? "No orders found for this user"
                        : "Loading orders..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      )}

      {/* Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Order Notes</h3>

            <div className="mb-4 space-y-3">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>By: {note.createdBy?.name || "Unknown"}</span>
                      <span className="ml-2">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
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
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDirectory;
