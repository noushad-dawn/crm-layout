
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import InfiniteScroll from "react-infinite-scroll-component";
// import config from "../config";

// const AssignTable = () => {
//   const [orders, setOrders] = useState([]); // All orders
//   const [filteredOrders, setFilteredOrders] = useState([]); // Orders after filtering
//   const [visibleOrders, setVisibleOrders] = useState([]); // Orders displayed based on pagination
//   const [drivers, setDrivers] = useState([]); // List of drivers
//   const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for assigning driver
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const [searchQuery, setSearchQuery] = useState(""); // Search term
//   const [routesData, setRoutesData] = useState([]); // Route data
//   const [page, setPage] = useState(1); // Pagination page
//   const [hasMore, setHasMore] = useState(true); // For infinite scroll
//   const pageSize = 100; // Number of orders to load at a time

//   useEffect(() => {
//     fetchOrders();
//     fetchRoutes();
//   }, []);

//   // Fetch all orders
//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/orders`);
//       const allOrders = response.data || [];
//       setOrders(allOrders);
//       setFilteredOrders(allOrders);
      
//       // Ensure first `pageSize` orders are displayed properly
//       setVisibleOrders(allOrders.length > 0 ? allOrders.slice(0, pageSize) : []);
      
//       setHasMore(allOrders.length > pageSize);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };
  

//   // Fetch route data
//   const fetchRoutes = async () => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/route-location/routes`);
//       setRoutesData(response.data || []);
//     } catch (error) {
//       console.error("Error fetching route data:", error);
//     }
//   };

//   // Load more orders for infinite scroll
//   const loadMoreOrders = () => {
//     if (!filteredOrders.length) {
//       setHasMore(false);
//       return;
//     }
  
//     const nextPage = page + 1;
//     const nextOrders = filteredOrders.slice(page * pageSize, nextPage * pageSize);
  
//     if (nextOrders.length === 0) {
//       setHasMore(false);
//     } else {
//       setVisibleOrders((prev) => [...prev, ...nextOrders]);
//       setPage(nextPage);
//     }
//   };
  

//   // Filter orders based on search term
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       // If search is cleared, reset to all orders
//       setFilteredOrders(orders);
//       setVisibleOrders(orders.slice(0, pageSize));
//       setPage(1);
//       setHasMore(orders.length > pageSize);
//     } else {
//       // Filter orders
//       const filtered = orders.filter(
//         (order) =>
//           order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           order.orderId.toString().includes(searchQuery)
//       );

//       setFilteredOrders(filtered);
//       setVisibleOrders(filtered.slice(0, pageSize));
//       setPage(1);
//       setHasMore(filtered.length > pageSize);
//     }
//   }, [searchQuery, orders]);
  

//   // Calculate TAT (Turnaround Time)
//   const calculateTAT = (dateOfOrder) => {
//     const currentDate = new Date();
//     const deliveryDate = new Date(dateOfOrder);
//     const timeDifference = deliveryDate - currentDate;

//     if (timeDifference < 0) {
//       return 0;
//     }

//     const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
//     return hoursLeft;
//   };

//   // Format TAT for display
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

//   // Get TAT class for styling
//   const getTATClass = (hoursLeft) => {
//     if (hoursLeft <= 24) return "text-red-600 font-bold";
//     if (hoursLeft <= 48) return "text-yellow-600 font-bold";
//     if (hoursLeft <= 72) return "text-green-600 font-bold";
//     return "text-gray-800";
//   };

//   // Find route by location
//   const findRouteByLocation = (locationName) => {
//     const route = routesData.find((route) =>
//       route.locations.some(
//         (location) => location.name.toLowerCase() === locationName.toLowerCase()
//       )
//     );
//     return route ? route.routeName : "No route found";
//   };

//   // Fetch drivers for a specific order
//   const fetchDrivers = async (order) => {
//     setSelectedOrder(order);
//     try {
//       const response = await axios.get(`${config.baseURL}/api/drivers`);
//       setDrivers(response.data || []);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching drivers:", error);
//       alert("Failed to fetch drivers. Please try again.");
//     }
//   };

//   // Assign driver to an order
//   const assignDriver = async (driver) => {
//         try {
//           const response = await axios.post(
//             `${config.baseURL}/api/orders/assign/${selectedOrder.orderId}`,
//             { driverId: driver.driverId, userId: selectedOrder.userID }
//           );
//           const licenseNumber = import.meta.env.REACT_APP_WHATSAPP_LICENSE_NUMBER;
//           const apiKey = import.meta.env.REACT_APP_WHATSAPP_API_KEY;
//           const contact = driver.phoneNumber.trim(); // The contact number you provided
//           const template = 'neworderdriver';
//           const name = driver.name.trim();
//           const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(name)},${encodeURIComponent(selectedOrder.totalPrice.toFixed(2))},${encodeURIComponent(selectedOrder.orderId)},${encodeURIComponent(selectedOrder.name.trim())},${encodeURIComponent(selectedOrder.address.replaceAll(",", ";").trim())},${encodeURIComponent(selectedOrder.phoneNumber.trim())}&Name=${encodeURIComponent(name)}`;
//           axios
//             .get(url)
//             .then((response) => {
//               console.log('Response:', response.data);
//             })
//             .catch((error) => {
//               console.error('Error:', error);
//             });
//           fetchOrders();
//           alert(`Driver assigned successfully: ${response.data.message}`);
//           setIsModalOpen(false);
//         } catch (error) {
//           console.error('Error assigning driver:', error);
//           alert('Failed to assign driver. Please try again.');
//         }
//       };

//   return (
//     <div className="container mx-auto p-6 mt-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-8">Orders to be Delivered</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search by Name or Order ID"
//           className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Scrollable container with Infinite Scroll */}
//       <div id="scrollableDiv" className="overflow-y-auto max-h-[40rem] border border-gray-300 rounded">
//         <InfiniteScroll
//           dataLength={visibleOrders.length}
//           next={loadMoreOrders}
//           hasMore={hasMore}
//           loader={<p className="text-center p-2 text-sm">Loading more orders...</p>}
//           scrollableTarget="scrollableDiv"
//         >
//           <table className="min-w-full bg-white border-collapse">
//             <thead className="bg-gray-200 sticky top-0">
//               <tr className="bg-gray-300 text-gray-700">
//                 <th className="py-2 px-4 bg-gray-100 border">Order ID</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Name</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Category</th>
//                 <th className="py-2 px-4 bg-gray-100 border">TAT</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Phone Number</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Product</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Address</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Location</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Route</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Units</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Total Price</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Payment Method</th>
//                 <th className="py-2 px-4 bg-gray-100 border">Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleOrders
//                 .filter((order) => order.status === "Ready to be Delivered" && !order.assigned)
//                 .map((order) => {
//                   const hoursLeft = calculateTAT(order.dateOfOrder);
//                   const tatClass = getTATClass(hoursLeft);
//                   const tatDisplay = formatTAT(hoursLeft);
//                   const route = findRouteByLocation(order.location);
//                   return (
//                     <tr key={order._id} className="hover:bg-gray-100">
//                       <td className={`py-2 px-4 bg-gray-100 border ${tatClass}`}>{order.orderId}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.name}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.category.join(", ")}</td>
//                       <td className={`py-2 px-4 bg-gray-100 border ${tatClass}`}>{tatDisplay}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.phoneNumber}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">
//                         {order.products
//                           .map((prod, index) => {
//                             let unit = order.units[index];
//                             let cat = order.category[index];
//                             if (cat.includes("Kilowise")) {
//                               unit = `${unit}KG`;
//                             }
//                             return `${prod}: ${unit}`;
//                           })
//                           .join(", ")}
//                       </td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.address}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.location}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{route}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">
//                         {order.units.reduce((num, acc) => num + acc).toFixed(0)}
//                       </td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.totalPrice.toFixed(2)}</td>
//                       <td className="py-2 px-4 bg-gray-100 border">{order.mode}</td>
//                       <td className="py-3 px-6 bg-gray-100 border">
//                         <button
//                           onClick={() => fetchDrivers(order)}
//                           className={`px-4 py-2 ${
//                             order.assigned
//                               ? "bg-gray-400 cursor-not-allowed"
//                               : "bg-blue-500 text-white hover:bg-blue-600"
//                           } rounded`}
//                           disabled={order.assigned}
//                         >
//                           {order.assigned ? "Assigned" : "Assign"}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </InfiniteScroll>
//       </div>

//       {/* Modal for assigning drivers */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">
//               Select Driver for Order ID: {selectedOrder.orderId}
//             </h2>
//             {drivers.length > 0 ? (
//               drivers.map((driver) => (
//                 <div key={driver.driverId} className="flex justify-between items-center mb-2">
//                   <span>{driver.name}</span>
//                   <button
//                     onClick={() => assignDriver(driver)}
//                     className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded"
//                   >
//                     Assign
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p>No drivers available</p>
//             )}
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignTable;

import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import config from "../config";

const AssignTable = () => {
  const [orders, setOrders] = useState([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders after filtering
  const [visibleOrders, setVisibleOrders] = useState([]); // Orders displayed based on pagination
  const [drivers, setDrivers] = useState([]); // List of drivers
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for assigning driver
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [searchQuery, setSearchQuery] = useState(""); // Search term
  const [routesData, setRoutesData] = useState([]); // Route data
  const [page, setPage] = useState(1); // Pagination page
  const [hasMore, setHasMore] = useState(true); // For infinite scroll
  const pageSize = 100; // Number of orders to load at a time

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, []);

  // Fetch all orders or filtered orders based on search
  const fetchOrders = async (searchTerm = "") => {
    try {
      let url = `${config.baseURL}/api/orders`;
      if (searchTerm.trim() !== "") {
        url = `${config.baseURL}/api/orders/search?query=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await axios.get(url);
      const fetchedOrders = response.data || [];
      
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setVisibleOrders(fetchedOrders.length > 0 ? fetchedOrders.slice(0, pageSize) : []);
      setHasMore(fetchedOrders.length > pageSize);
      setPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch route data
  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/route-location/routes`);
      setRoutesData(response.data || []);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  // Load more orders for infinite scroll
  const loadMoreOrders = () => {
    if (!filteredOrders.length) {
      setHasMore(false);
      return;
    }
  
    const nextPage = page + 1;
    const nextOrders = filteredOrders.slice(page * pageSize, nextPage * pageSize);
  
    if (nextOrders.length === 0) {
      setHasMore(false);
    } else {
      setVisibleOrders((prev) => [...prev, ...nextOrders]);
      setPage(nextPage);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate TAT (Turnaround Time)
  const calculateTAT = (dateOfOrder) => {
    const currentDate = new Date();
    const deliveryDate = new Date(dateOfOrder);
    const timeDifference = deliveryDate - currentDate;

    if (timeDifference < 0) {
      return 0;
    }

    const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
    return hoursLeft;
  };

  // Format TAT for display
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

  // Get TAT class for styling
  const getTATClass = (hoursLeft) => {
    if (hoursLeft <= 24) return "text-red-600 font-bold";
    if (hoursLeft <= 48) return "text-yellow-600 font-bold";
    if (hoursLeft <= 72) return "text-green-600 font-bold";
    return "text-gray-800";
  };

  // Find route by location
  const findRouteByLocation = (locationName) => {
    const route = routesData.find((route) =>
      route.locations.some(
        (location) => location.name.toLowerCase() === locationName.toLowerCase()
      )
    );
    return route ? route.routeName : "No route found";
  };

  // Fetch drivers for a specific order
  const fetchDrivers = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await axios.get(`${config.baseURL}/api/drivers`);
      setDrivers(response.data || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Failed to fetch drivers. Please try again.");
    }
  };

  // Assign driver to an order
  const assignDriver = async (driver) => {
    try {
      const response = await axios.post(
        `${config.baseURL}/api/orders/assign/${selectedOrder.orderId}`,
        { driverId: driver.driverId, userId: selectedOrder.userID }
      );
      const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
      const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;
      const contact = driver.phoneNumber.trim(); // The contact number you provided
      const template = 'neworderdriver';
      const name = driver.name.trim();
      const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(name)},${encodeURIComponent(selectedOrder.totalPrice.toFixed(2))},${encodeURIComponent(selectedOrder.orderId)},${encodeURIComponent(selectedOrder.name.trim())},${encodeURIComponent(selectedOrder.address.replaceAll(",", ";").trim())},${encodeURIComponent(selectedOrder.phoneNumber.trim())}&Name=${encodeURIComponent(name)}`;
      axios
        .get(url)
        .then((response) => {
          console.log('Response:', response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      fetchOrders(searchQuery);
      alert(`Driver assigned successfully: ${response.data.message}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Orders to be Delivered</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name or Order ID"
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Scrollable container with Infinite Scroll */}
      <div id="scrollableDiv" className="overflow-y-auto max-h-[40rem] border border-gray-300 rounded">
        <InfiniteScroll
          dataLength={visibleOrders.length}
          next={loadMoreOrders}
          hasMore={hasMore}
          loader={<p className="text-center p-2 text-sm">Loading more orders...</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-200 sticky top-0">
              <tr className="bg-gray-300 text-gray-700">
                <th className="py-2 px-4 bg-gray-100 border">Order ID</th>
                <th className="py-2 px-4 bg-gray-100 border">Name</th>
                <th className="py-2 px-4 bg-gray-100 border">Category</th>
                <th className="py-2 px-4 bg-gray-100 border">TAT</th>
                <th className="py-2 px-4 bg-gray-100 border">Phone Number</th>
                <th className="py-2 px-4 bg-gray-100 border">Product</th>
                <th className="py-2 px-4 bg-gray-100 border">Address</th>
                <th className="py-2 px-4 bg-gray-100 border">Location</th>
                <th className="py-2 px-4 bg-gray-100 border">Route</th>
                <th className="py-2 px-4 bg-gray-100 border">Units</th>
                <th className="py-2 px-4 bg-gray-100 border">Total Price</th>
                <th className="py-2 px-4 bg-gray-100 border">Payment Method</th>
                <th className="py-2 px-4 bg-gray-100 border">Assign</th>
              </tr>
            </thead>
            <tbody>
              {!visibleOrders && visibleOrders.length !== 0
                .filter((order) => order.status === "Ready to be Delivered" && !order.assigned)
                .map((order) => {
                  const hoursLeft = calculateTAT(order.dateOfOrder);
                  const tatClass = getTATClass(hoursLeft);
                  const tatDisplay = formatTAT(hoursLeft);
                  const route = findRouteByLocation(order.location);
                  return (
                    <tr key={order._id} className="hover:bg-gray-100">
                      <td className={`py-2 px-4 bg-gray-100 border ${tatClass}`}>{order.orderId}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.name}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.category.join(", ")}</td>
                      <td className={`py-2 px-4 bg-gray-100 border ${tatClass}`}>{tatDisplay}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.phoneNumber}</td>
                      <td className="py-2 px-4 bg-gray-100 border">
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
                      <td className="py-2 px-4 bg-gray-100 border">{order.address}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.location}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{route}</td>
                      <td className="py-2 px-4 bg-gray-100 border">
                        {order.units.reduce((num, acc) => num + acc).toFixed(0)}
                      </td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.totalPrice.toFixed(2)}</td>
                      <td className="py-2 px-4 bg-gray-100 border">{order.mode}</td>
                      <td className="py-3 px-6 bg-gray-100 border">
                        <button
                          onClick={() => fetchDrivers(order)}
                          className={`px-4 py-2 ${
                            order.assigned
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          } rounded`}
                          disabled={order.assigned}
                        >
                          {order.assigned ? "Assigned" : "Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {/* Modal for assigning drivers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Select Driver for Order ID: {selectedOrder.orderId}
            </h2>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <div key={driver.driverId} className="flex justify-between items-center mb-2">
                  <span>{driver.name}</span>
                  <button
                    onClick={() => assignDriver(driver)}
                    className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded"
                  >
                    Assign
                  </button>
                </div>
              ))
            ) : (
              <p>No drivers available</p>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTable;