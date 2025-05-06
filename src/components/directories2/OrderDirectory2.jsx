// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import config from "../config";
// import InfiniteScroll from "react-infinite-scroll-component";

// const OrderDirectory = () => {
//   const [orders, setOrders] = useState([]); // All orders from the backend
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [notes, setNotes] = useState({});
//   const [visibleOrders, setVisibleOrders] = useState([]); // Orders currently visible
//   const [hasMore, setHasMore] = useState(true); // Whether there are more orders to load
//   const [page, setPage] = useState(0); // Current page for pagination
//   const pageSize = 10; // Number of orders to load per page

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${config.baseURL}/api/orders`);
//         setOrders(response.data);
//         setVisibleOrders(response.data.slice(0, pageSize)); // Load initial set of orders
//         setHasMore(response.data.length > pageSize); // Set hasMore based on total orders
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     // Update visible orders when filters change
//     const filtered = orders.filter((order) => {
//       const isOrderIdMatch = order.orderId
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());

//       const isWithinDateRange =
//         (!startDate || new Date(order.dateOfOrder) >= new Date(startDate)) &&
//         (!endDate || new Date(order.dateOfOrder) <= new Date(endDate));

//       return isOrderIdMatch && isWithinDateRange;
//     });

//     setVisibleOrders(filtered.slice(0, pageSize)); // Reset visible orders to the first page
//     setPage(0); // Reset page to 0
//     setHasMore(filtered.length > pageSize); // Update hasMore based on filtered data
//   }, [orders, searchTerm, startDate, endDate]);

//   const openNoteModal = (orderId) => {
//     fetchNotes(orderId);
//     setIsNoteModalOpen(true);
//   };

//   const fetchNotes = async (orderId) => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/note/${orderId}`);
//       setNotes(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching notes", error);
//     }
//   };

//   const calculateTAT = (dateOfDelivery) => {
//     const currentDate = new Date();
//     const deliveryDate = new Date(dateOfDelivery);
//     const timeDifference = deliveryDate - currentDate;

//     if (timeDifference < 0) {
//       return 0;
//     }

//     const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
//     return hoursLeft;
//   };

//   const formatTAT = (hoursLeft) => {
//     if (hoursLeft === 0) {
//       return "0 hrs";
//     }
//     if (hoursLeft > 72) {
//       const daysLeft = Math.floor(hoursLeft / 24);
//       return `${daysLeft} days`;
//     } else {
//       return `${hoursLeft} hrs`;
//     }
//   };

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

//   if (loading) {
//     return <div className="text-center p-4">Loading orders...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4 mt-12">
//       <h2 className="text-2xl font-bold mb-4">Order Directory</h2>

//       {/* Search Input and Date Range Filter */}
//       <div className="mb-4 flex gap-4">
//         <input
//           type="text"
//           placeholder="Search by Order ID"
//           className="p-2 border border-gray-300 w-1/4 rounded"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <input
//           type="date"
//           className="p-2 border border-gray-300 rounded"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//         <input
//           type="date"
//           className="p-2 border border-gray-300 rounded"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//       </div>

//       <div id="scrollableDiv" className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg">
//         <InfiniteScroll
//           dataLength={visibleOrders.length}
//           next={loadMoreOrders}
//           hasMore={hasMore}
//           loader={
//             <div className="text-center p-4 text-gray-500">
//               Loading more orders...
//             </div>
//           }
//           scrollableTarget="scrollableDiv"
//         >
//           <table className="min-w-full bg-white shadow-md rounded-lg">
//             <thead>
//               <tr>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Order ID</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Date of Order</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">
//                   Date of Delivery
//                 </th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">TAT</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Category</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Product</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Garment Details</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Total Price</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Customer Name</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Phone Number</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Address</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Location</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Notes</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">D&P Charge</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Discount</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Payment Status</th>
//                 <th className="py-2 px-4 bg-gray-100 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleOrders.map((order) => {
//                 const hoursLeft = calculateTAT(order.dateOfDelivery);
//                 const tatDisplay = formatTAT(hoursLeft);
//                 return (
//                   <tr key={order._id} className="border-b">
//                     <td className="py-2 px-4">{order.orderId}</td>
//                     <td className="py-2 px-4">
//                       {new Date(order.dateOfOrder).toISOString().slice(0, 10)}
//                     </td>
//                     <td className="py-2 px-4">
//                       {new Date(order.dateOfDelivery).toISOString().slice(0, 10)}
//                     </td>
//                     <td className="py-2 px-4">{tatDisplay}</td>
//                     <td className="py-2 px-4">{order.category.join(", ")}</td>
//                     <td className="py-2 px-4">
//                       {order.products
//                         .map((prod, index) => {
//                           let unit = order.units[index];
//                           let cat = order.category[index];
//                           if (cat.includes("Kilowise")) {
//                             unit = `${unit}KG`;
//                           }
//                           return `${prod}: ${unit}`;
//                         })
//                         .join(", ")}
//                     </td>
//                     <td className="py-2 px-4">
//                       {order.garmentDetails
//                         .map((garmentDetails, index) => {
//                           return garmentDetails
//                             .map(
//                               (garment, i) =>
//                                 `${garment}: ${order.subUnits[index][i]}`
//                             )
//                             .join(", ");
//                         })
//                         .filter((pair) => pair !== "")
//                         .join(", ")}
//                     </td>
//                     <td className="py-2 px-4">{order.totalPrice.toFixed(2)}</td>
//                     <td className="py-2 px-4">{order.name}</td>
//                     <td className="py-2 px-4">{order.phoneNumber}</td>
//                     <td className="py-2 px-4">{order.address}</td>
//                     <td className="py-2 px-4">{order.location}</td>
//                     <td className="py-2 px-4">
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded"
//                         onClick={() => openNoteModal(order._id)}
//                       >
//                         View Notes
//                       </button>
//                     </td>
//                     <td className="py-2 px-4">{order.delivery ? 50 : 0}</td>
//                     <td className="py-2 px-4">{order?.discount || 0}</td>
//                     <td className="py-2 px-4">{order.paymentStatus}</td>
//                     <td className="py-2 px-4">{order.status}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </InfiniteScroll>
//       </div>

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

// export default OrderDirectory;

import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import InfiniteScroll from "react-infinite-scroll-component";

const OrderDirectory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const fetchOrders = async (search = "", start = "", end = "") => {
    try {
      const params = {};
      if (search) params.search = search;
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await axios.get(`${config.baseURL}/api/orders`, {
        params,
      });
      setOrders(response.data);
      setVisibleOrders(response.data.slice(0, pageSize));
      setHasMore(response.data.length > pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders(searchTerm, startDate, endDate);
  }, [searchTerm, startDate, endDate]);

  const openNoteModal = (orderId) => {
    fetchNotes(orderId);
    setIsNoteModalOpen(true);
  };

  const fetchNotes = async (orderId) => {
    try {
      const response = await axios.get(`${config.baseURL}/api/note/${orderId}`);
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

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
      return "0 hrs";
    }
    if (hoursLeft > 72) {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${daysLeft} days`;
    } else {
      return `${hoursLeft} hrs`;
    }
  };

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

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold mb-4">Order Directory</h2>

      {/* Search Input and Date Range Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="p-2 border border-gray-300 w-1/4 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div
        id="scrollableDiv"
        className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg"
      >
        <InfiniteScroll
          dataLength={visibleOrders.length}
          next={loadMoreOrders}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4 text-gray-500">
              Loading more orders...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-100 text-left">Order ID</th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Date of Order
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Date of Delivery
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">TAT</th>
                <th className="py-2 px-4 bg-gray-100 text-left">Category</th>
                <th className="py-2 px-4 bg-gray-100 text-left">Product</th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Garment Details
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">Total Price</th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Customer Name
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Phone Number
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">Address</th>
                <th className="py-2 px-4 bg-gray-100 text-left">Location</th>
                <th className="py-2 px-4 bg-gray-100 text-left">Notes</th>
                <th className="py-2 px-4 bg-gray-100 text-left">D&P Charge</th>
                <th className="py-2 px-4 bg-gray-100 text-left">Discount</th>
                <th className="py-2 px-4 bg-gray-100 text-left">
                  Payment Status
                </th>
                <th className="py-2 px-4 bg-gray-100 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* {visibleOrders.map((order) => {
                const hoursLeft = calculateTAT(order.dateOfDelivery);
                const tatDisplay = formatTAT(hoursLeft);
                return (
                  <tr key={order._id} className="border-b">
                    <td className="py-2 px-4">{order.orderId}</td>
                    <td className="py-2 px-4">
                      {new Date(order.dateOfOrder).toISOString().slice(0, 10)}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(order.dateOfDelivery).toISOString().slice(0, 10)}
                    </td>
                    <td className="py-2 px-4">{tatDisplay}</td>
                    <td className="py-2 px-4">{order.category.join(", ")}</td>
                    <td className="py-2 px-4">
                      {order.products
                        .map((prod, index) => {
                          let unit = order.units[index];
                          let cat = order.category[index];
                          if (cat.includes("Kilowise")) {
                            unit = `${unit}KG`;
                          }
                          return `${prod}: ${unit}`;
                        })
                        .join(", ")}
                    </td>
                    <td className="py-2 px-4">
                      {order.garmentDetails
                        .map((garmentDetails, index) => {
                          return garmentDetails
                            .map(
                              (garment, i) =>
                                `${garment}: ${order.subUnits[index][i]}`
                            )
                            .join(", ");
                        })
                        .filter((pair) => pair !== "")
                        .join(", ")}
                    </td>
                    <td className="py-2 px-4">{order.totalPrice.toFixed(2)}</td>
                    <td className="py-2 px-4">{order.name}</td>
                    <td className="py-2 px-4">{order.phoneNumber}</td>
                    <td className="py-2 px-4">{order.address}</td>
                    <td className="py-2 px-4">{order.location}</td>
                    <td className="py-2 px-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => openNoteModal(order._id)}
                      >
                        View Notes
                      </button>
                    </td>
                    <td className="py-2 px-4">{order.delivery ? 50 : 0}</td>
                    <td className="py-2 px-4">{order?.discount || 0}</td>
                    <td className="py-2 px-4">{order.paymentStatus}</td>
                    <td className="py-2 px-4">{order.status}</td>
                  </tr>
                );
              })} */}

              {Array.isArray(visibleOrders) && visibleOrders.length > 0 ? (
                visibleOrders.map((order) => {
                  const hoursLeft = calculateTAT(order.dateOfDelivery);
                  const tatDisplay = formatTAT(hoursLeft);
                  return (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 px-4">{order.orderId}</td>
                      <td className="py-2 px-4">
                        {new Date(order.dateOfOrder).toISOString().slice(0, 10)}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(order.dateOfDelivery)
                          .toISOString()
                          .slice(0, 10)}
                      </td>
                      <td className="py-2 px-4">{tatDisplay}</td>
                      <td className="py-2 px-4">{order.category.join(", ")}</td>
                      <td className="py-2 px-4">
                        {order.products
                          .map((prod, index) => {
                            let unit = order.units[index];
                            let cat = order.category[index];
                            if (cat.includes("Kilowise")) {
                              unit = `${unit}KG`;
                            }
                            return `${prod}: ${unit}`;
                          })
                          .join(", ")}
                      </td>
                      <td className="py-2 px-4">
                        {order.garmentDetails
                          .map((garmentDetails, index) => {
                            return garmentDetails
                              .map(
                                (garment, i) =>
                                  `${garment}: ${order.subUnits[index][i]}`
                              )
                              .join(", ");
                          })
                          .filter((pair) => pair !== "")
                          .join(", ")}
                      </td>
                      <td className="py-2 px-4">
                        {order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-4">{order.name}</td>
                      <td className="py-2 px-4">{order.phoneNumber}</td>
                      <td className="py-2 px-4">{order.address}</td>
                      <td className="py-2 px-4">{order.location}</td>
                      <td className="py-2 px-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={() => openNoteModal(order._id)}
                        >
                          View Notes
                        </button>
                      </td>
                      <td className="py-2 px-4">{order.delivery ? 50 : 0}</td>
                      <td className="py-2 px-4">{order?.discount || 0}</td>
                      <td className="py-2 px-4">{order.paymentStatus}</td>
                      <td className="py-2 px-4">{order.status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="16" className="text-center py-4 text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
            <h3 className="text-xl font-semibold mb-4">Order Notes</h3>
            <ul className="list-disc list-inside">
              {notes.length > 0 ? (
                notes.map((note, index) => <li key={index}>{note}</li>)
              ) : (
                <li>No notes available.</li>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setIsNoteModalOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDirectory;
