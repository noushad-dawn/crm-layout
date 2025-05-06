// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import config from '../config';

// const DriverStatus = () => {
//   const [drivers, setDrivers] = useState([]);
//   const [routesData, setRoutesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState();
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
//   const licenseNumber = import.meta.env.REACT_APP_WHATSAPP_LICENSE_NUMBER;
//   const apiKey = import.meta.env.REACT_APP_WHATSAPP_API_KEY;

//   const fetchDrivers = async () => {
//     try {
//       setLoading(true); // Show loading state while fetching
//       const response = await axios.get(`${config.baseURL}/api/drivers/status`);
//       // console.log(response.data);
//       setDrivers(response.data || []);
//     } catch (error) {
//       console.error('Error fetching driver data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentMethodChange = (e) => {
//     setSelectedPaymentMethod(e.target.value);
//   };

//   const sendOrderStatus = async (order) => {
//       const contact = order.phoneNumber.trim(); // The contact number you provided
//       const template1 = 'delivery_customer';
//       const name = order.name.trim();
//       //       Hello {{1}},
//       // Your order {{2}}} billed to {{3}} has been delivered successfully. Thank you for choosing Prime Laundry as your cleaning partner!
//       // Have a freshening day ahead!
//       const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template1)}&Param=${encodeURIComponent(name)},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.totalPrice.toFixed(2))}&Name=${encodeURIComponent(name)}`;
//       axios
//       .get(url1)
//       .then((response) => {
//         console.log('Response:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//       const template2 = 'delivery_clients';
//       const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent("8234012896")}&Template=${encodeURIComponent(template2)}&Param=${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(name)},${encodeURIComponent(order.location.replaceAll(",", ";").trim())},${encodeURIComponent(order.driverName)}&Name=${encodeURIComponent(name)}`;
//       axios
//         .get(url2)
//         .then((response) => {
//           console.log('Response:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//   }

//   const updateOrderStatus = async (order, newStatus) => {
//     try {
//       await axios.patch(`${config.baseURL}/api/orders/orderId/${order.orderId}`, {
//         status: newStatus,
//       });
//       sendOrderStatus(order)
//       fetchDrivers(); // Re-fetch drivers after the status update
//     } catch (err) {
//       console.error('Error updating order status:', err);
//     }
//   };

//   const sendPaymentStatus = async(order) => {
// //     Your payment via {{5}} has been received successfully of amount{{1}}  for order{{2}} , Category: {{3}}, garment details{{4}}.
// //  Thank you for choosing Prime Laundry! Your Wear, Our Care!
//   const contact = order.phoneNumber.trim(); // The contact number you provided
//   const template = 'payment_customerr';
//   const name = order.name.trim();
//   const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.category.join('; '))},${encodeURIComponent(order.id.garmentDetails.flat().join('; '))||'none'},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
//   axios
//     .get(url1)
//     .then((response) => {
//       console.log('Response:', response.data);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent("8234012896")}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.category.join('; '))},${encodeURIComponent(order.id.garmentDetails.flat().join('; '))||'none'},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
//   axios
//     .get(url2)
//     .then((response) => {
//       console.log('Response:', response.data);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   }

//   const handleConfirmPaymentMethod = async() => {
//     const id = selectedDriver.orderId;
//     try {
//       const response = await axios.post(`${config.baseURL}/api/orders/updatePaymentMode/${id}`, {
//         paymentMode: selectedPaymentMethod,
//       });

//       if (response.status === 200) {
//         alert(`Payment Mode for Order ID ${id} has been changed to ${selectedPaymentMethod}.`);
//       } else {
//         alert(`Failed to update payment status for Order ID ${id}.`);
//       }

//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       alert('An error occurred while updating the payment status.');
//     }
//     try {
//       const response = await axios.post(`${config.baseURL}/api/orders/updatePaymentStatus/${id}`, {
//         paymentStatus: selectedStatus,
//       });

//       if (response.status === 200) {
//         alert(`Payment status for Order ID ${id} has been changed to ${selectedStatus}.`);
//         sendPaymentStatus(selectedDriver);
//       } else {
//         alert(`Failed to update payment status for Order ID ${id}.`);
//       }

//       fetchDrivers();
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       alert('An error occurred while updating the payment status.');
//     }
//     setShowPopup(false);
//   }

//   const handlePaymentStatusChange = async (driver, newStatus) => {
//     setSelectedDriver(driver);
//     setSelectedStatus(newStatus);
//     setShowPopup(true);
//   };

//   const fetchRoutes = async () => {
//     setLoading(true); // Show loading state while fetching data
//     try {
//       const response = await axios.get(`${config.baseURL}/api/route-location/routes`);
//       // console.log(response.data);
//       setRoutesData(response.data || []);
//     } catch (error) {
//       console.error('Error fetching driver data:', error);
//     } finally {
//       setLoading(false); // Hide loading state after fetching data
//     }
//   };

//   const findRouteByLocation = (locationName) => {
//     const route = routesData.find(route => {
//         return route.locations.some(location => location.name.toLowerCase() === locationName.toLowerCase());
//     });

//     return route ? route.routeName : 'No route found';
//   };

//   const handleStatusChange = (order, e) => {
//     const newStatus = e.target.value;
//     const confirmed = window.confirm(
//       `Are you sure you want to change the status to "${newStatus}"?`
//     );
//     if (!confirmed) return;
//     updateOrderStatus(order, newStatus);
//   };

//   // Initial fetch when the component mounts
//   useEffect(() => {
//     fetchDrivers();
//     fetchRoutes();
//   }, []);

//   const fetchApis = () => {
//     fetchDrivers();
//     fetchRoutes();
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4 mt-8 mb-12">
//       <h2 className="text-2xl font-bold mb-4">Driver Status</h2>
//       <button
//         onClick={fetchApis}
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
//       >
//         Refresh
//       </button>
//       <div className="overflow-y-auto max-h-[40rem]">
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead className="sticky top-0 bg-gray-200 z-10">
//             <tr className="bg-gray-200">
//               <th className="py-2 px-4 border border-gray-300">Driver ID</th>
//               <th className="py-2 px-4 border border-gray-300">Driver Name</th>
//               <th className="py-2 px-4 border border-gray-300">Order ID</th>
//               <th className="py-2 px-4 border border-gray-300">Customer Name</th>
//               <th className="py-2 px-4 border border-gray-300">Address</th>
//               <th className="py-2 px-4 border border-gray-300">Locatin</th>
//               <th className="py-2 px-4 border border-gray-300">Route</th>
//               <th className="py-2 px-4 border border-gray-300">Phone Number</th>
//               <th className="py-2 px-4 border border-gray-300">Product</th>
//               <th className="py-2 px-4 border border-gray-300">Total Payment</th>
//               <th className="py-2 px-4 border border-gray-300">Mode</th>
//               <th className="py-2 px-4 border border-gray-300">Payment Status</th>
//               <th className="py-2 px-4 border border-gray-300">Date of Delivery</th>
//               <th className="py-2 px-4 border border-gray-300">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {drivers
//               .filter((driver) => driver.id.status !== 'Delivered' || driver.id.paymentStatus !== 'Completed')
//               .map((driver, index) => {
//                 const route = findRouteByLocation(driver.id?.location);
//                 return (
//                 <tr key={index} className="hover:bg-gray-100">
//                   <td className="py-2 px-4 border border-gray-300">{driver.driverId}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.driverName}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.orderId}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.name}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.id?.address}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.id?.location}</td>
//                   <td className="py-2 px-4 border border-gray-300">{route}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.phoneNumber}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.id?.products}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.id?.totalPrice.toFixed(2)}</td>
//                   <td className="py-2 px-4 border border-gray-300">{driver.id?.mode}</td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     <select
//                       value={driver.id.paymentStatus}
//                       onChange={(e) => handlePaymentStatusChange(driver, e.target.value)}
//                       disabled={driver.id.paymentStatus === 'Completed'}
//                       className="border border-gray-300 rounded p-2 shadow"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Completed">Completed</option>
//                       <option value="Failed">Failed</option>
//                     </select>
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">{new Date(driver.id?.dateOfDelivery)
//                           .toISOString()
//                           .slice(0, 10)}</td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     <select
//                       className="border p-1 rounded"
//                       value={driver.id?.status}
//                       onChange={(e) => handleStatusChange(driver, e)}
//                     >
//                       <option value="Ready to be Delivered">Ready to be delivered</option>
//                       <option value="On route">On route</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                 </tr>
//               )})}
//           </tbody>
//         </table>
//       </div>
//       {showPopup && (
//         <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3">
//             <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
//             <div>
//               <label className="block mb-2">Payment Method</label>
//               <select
//                 value={selectedPaymentMethod}
//                 onChange={handlePaymentMethodChange}
//                 className="border rounded px-2 py-1 w-full"
//               >
//                 <option value="">Select a method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Debit Card">Debit Card</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Net Banking">Net Banking</option>
//               </select>
//             </div>
//             <div className="mt-4 text-right">
//               <button
//                 onClick={handleConfirmPaymentMethod}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );

// };

// export default DriverStatus;

// import React, { useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import axios from 'axios';
// import config from '../config';

// const DriverStatus = () => {
//   const [allDrivers, setAllDrivers] = useState([]);
//   const [visibleDrivers, setVisibleDrivers] = useState([]);
//   const [routesData, setRoutesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState();
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 10;

//   const licenseNumber = import.meta.env.REACT_APP_WHATSAPP_LICENSE_NUMBER;
//   const apiKey = import.meta.env.REACT_APP_WHATSAPP_API_KEY;

//   const fetchDrivers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${config.baseURL}/api/drivers/status`);
//       setAllDrivers(response.data || []);
//       setVisibleDrivers(response.data.slice(0, itemsPerPage) || []);
//       setPage(1);
//       setHasMore(response.data.length > itemsPerPage);
//     } catch (error) {
//       console.error('Error fetching driver data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load more data when page changes
//   useEffect(() => {
//     if (allDrivers.length > 0) {
//       const nextItems = allDrivers.slice(0, page * itemsPerPage);
//       setVisibleDrivers(nextItems);
//       setHasMore(nextItems.length < allDrivers.length);
//     }
//   }, [page, allDrivers]);

//   const fetchMoreData = () => {
//     if (visibleDrivers.length >= allDrivers.length) {
//       setHasMore(false);
//       return;
//     }
//     setPage(prevPage => prevPage + 1);
//   };

//   const handlePaymentMethodChange = (e) => {
//     setSelectedPaymentMethod(e.target.value);
//   };

//   const sendOrderStatus = async (order) => {
//     const contact = order.phoneNumber.trim();
//     const template1 = 'delivery_customer';
//     const name = order.name.trim();
//     const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template1)}&Param=${encodeURIComponent(name)},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.totalPrice.toFixed(2))}&Name=${encodeURIComponent(name)}`;
//     axios.get(url1)
//       .then((response) => {
//         console.log('Response:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });

//     const template2 = 'delivery_clients';
//     const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent("8234012896")}&Template=${encodeURIComponent(template2)}&Param=${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(name)},${encodeURIComponent(order.location.replaceAll(",", ";").trim())},${encodeURIComponent(order.driverName)}&Name=${encodeURIComponent(name)}`;
//     axios.get(url2)
//       .then((response) => {
//         console.log('Response:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   }

//   const updateOrderStatus = async (order, newStatus) => {
//     try {
//       await axios.patch(`${config.baseURL}/api/orders/orderId/${order.orderId}`, {
//         status: newStatus,
//       });
//       sendOrderStatus(order);
//       fetchDrivers();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//     }
//   };

//   const sendPaymentStatus = async(order) => {
//     const contact = order.phoneNumber.trim();
//     const template = 'payment_customerr';
//     const name = order.name.trim();
//     const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.category.join('; '))},${encodeURIComponent(order.id.garmentDetails.flat().join('; '))||'none'},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
//     axios.get(url1)
//       .then((response) => {
//         console.log('Response:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });

//     const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent("8234012896")}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.id.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.id.category.join('; '))},${encodeURIComponent(order.id.garmentDetails.flat().join('; '))||'none'},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
//     axios.get(url2)
//       .then((response) => {
//         console.log('Response:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   }

//   const handleConfirmPaymentMethod = async() => {
//     const id = selectedDriver.orderId;
//     try {
//       const response = await axios.post(`${config.baseURL}/api/orders/updatePaymentMode/${id}`, {
//         paymentMode: selectedPaymentMethod,
//       });

//       if (response.status === 200) {
//         alert(`Payment Mode for Order ID ${id} has been changed to ${selectedPaymentMethod}.`);
//       } else {
//         alert(`Failed to update payment status for Order ID ${id}.`);
//       }

//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       alert('An error occurred while updating the payment status.');
//     }
//     try {
//       const response = await axios.post(`${config.baseURL}/api/orders/updatePaymentStatus/${id}`, {
//         paymentStatus: selectedStatus,
//       });

//       if (response.status === 200) {
//         alert(`Payment status for Order ID ${id} has been changed to ${selectedStatus}.`);
//         sendPaymentStatus(selectedDriver);
//       } else {
//         alert(`Failed to update payment status for Order ID ${id}.`);
//       }

//       fetchDrivers();
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       alert('An error occurred while updating the payment status.');
//     }
//     setShowPopup(false);
//   }

//   const handlePaymentStatusChange = async (driver, newStatus) => {
//     setSelectedDriver(driver);
//     setSelectedStatus(newStatus);
//     setShowPopup(true);
//   };

//   const fetchRoutes = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${config.baseURL}/api/route-location/routes`);
//       setRoutesData(response.data || []);
//     } catch (error) {
//       console.error('Error fetching driver data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const findRouteByLocation = (locationName) => {
//     const route = routesData.find(route => {
//         return route.locations.some(location => location.name.toLowerCase() === locationName.toLowerCase());
//     });
//     return route ? route.routeName : 'No route found';
//   };

//   const handleStatusChange = (order, e) => {
//     const newStatus = e.target.value;
//     const confirmed = window.confirm(
//       `Are you sure you want to change the status to "${newStatus}"?`
//     );
//     if (!confirmed) return;
//     updateOrderStatus(order, newStatus);
//   };

//   useEffect(() => {
//     fetchDrivers();
//     fetchRoutes();
//   }, []);

//   const fetchApis = () => {
//     fetchDrivers();
//     fetchRoutes();
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4 mt-8 mb-12">
//       <h2 className="text-2xl font-bold mb-4">Driver Status</h2>
//       <button
//         onClick={fetchApis}
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
//       >
//         Refresh
//       </button>

//       <div id="scrollableDiv" style={{ maxHeight: '70vh', overflow: 'auto' }}>
//         <InfiniteScroll
//           dataLength={visibleDrivers.length}
//           next={fetchMoreData}
//           hasMore={hasMore}
//           loader={<div className="text-center p-4">Loading more drivers...</div>}
//           scrollableTarget="scrollableDiv"
//         >
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="sticky top-0 bg-gray-200 z-10">
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-4 border border-gray-300">Driver ID</th>
//                 <th className="py-2 px-4 border border-gray-300">Driver Name</th>
//                 <th className="py-2 px-4 border border-gray-300">Order ID</th>
//                 <th className="py-2 px-4 border border-gray-300">Customer Name</th>
//                 <th className="py-2 px-4 border border-gray-300">Address</th>
//                 <th className="py-2 px-4 border border-gray-300">Location</th>
//                 <th className="py-2 px-4 border border-gray-300">Route</th>
//                 <th className="py-2 px-4 border border-gray-300">Phone Number</th>
//                 <th className="py-2 px-4 border border-gray-300">Product</th>
//                 <th className="py-2 px-4 border border-gray-300">Total Payment</th>
//                 <th className="py-2 px-4 border border-gray-300">Mode</th>
//                 <th className="py-2 px-4 border border-gray-300">Payment Status</th>
//                 <th className="py-2 px-4 border border-gray-300">Date of Delivery</th>
//                 <th className="py-2 px-4 border border-gray-300">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleDrivers
//                 .filter((driver) => driver.id.status !== 'Delivered' || driver.id.paymentStatus !== 'Completed')
//                 .map((driver, index) => {
//                   const route = findRouteByLocation(driver.id?.location);
//                   return (
//                     <tr key={index} className="hover:bg-gray-100">
//                       <td className="py-2 px-4 border border-gray-300">{driver.driverId}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.driverName}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.orderId}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.name}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.id?.address}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.id?.location}</td>
//                       <td className="py-2 px-4 border border-gray-300">{route}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.phoneNumber}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.id?.products}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.id?.totalPrice.toFixed(2)}</td>
//                       <td className="py-2 px-4 border border-gray-300">{driver.id?.mode}</td>
//                       <td className="py-2 px-4 border border-gray-300">
//                         <select
//                           value={driver.id.paymentStatus}
//                           onChange={(e) => handlePaymentStatusChange(driver, e.target.value)}
//                           disabled={driver.id.paymentStatus === 'Completed'}
//                           className="border border-gray-300 rounded p-2 shadow"
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Completed">Completed</option>
//                           <option value="Failed">Failed</option>
//                         </select>
//                       </td>
//                       <td className="py-2 px-4 border border-gray-300">
//                         {new Date(driver.id?.dateOfDelivery).toISOString().slice(0, 10)}
//                       </td>
//                       <td className="py-2 px-4 border border-gray-300">
//                         <select
//                           className="border p-1 rounded"
//                           value={driver.id?.status}
//                           onChange={(e) => handleStatusChange(driver, e)}
//                         >
//                           <option value="Ready to be Delivered">Ready to be delivered</option>
//                           <option value="On route">On route</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </InfiniteScroll>
//       </div>

//       {showPopup && (
//         <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3">
//             <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
//             <div>
//               <label className="block mb-2">Payment Method</label>
//               <select
//                 value={selectedPaymentMethod}
//                 onChange={handlePaymentMethodChange}
//                 className="border rounded px-2 py-1 w-full"
//               >
//                 <option value="">Select a method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Debit Card">Debit Card</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Net Banking">Net Banking</option>
//               </select>
//             </div>
//             <div className="mt-4 text-right">
//               <button
//                 onClick={handleConfirmPaymentMethod}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DriverStatus;

// DriverStatus.js
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import config from "../config";

const DriverStatus = () => {
  const [allDrivers, setAllDrivers] = useState([]);
  const [visibleDrivers, setVisibleDrivers] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const itemsPerPage = 10;

  const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
  const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;

  const fetchDrivers = async (filter = {}) => {
    try {
      setLoading(true);
      let response;
      if (Object.keys(filter).length > 0) {
        response = await axios.get(
          `${config.baseURL}/api/drivers/status/filter`,
          { params: filter }
        );
      } else {
        response = await axios.get(`${config.baseURL}/api/drivers/status`);
      }
      setAllDrivers(response.data || []);
      setVisibleDrivers(response.data.slice(0, itemsPerPage) || []);
      setPage(1);
      setHasMore(response.data.length > itemsPerPage);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchDrivers();
      return;
    }
    const filter = { [searchField]: searchTerm.trim() };
    fetchDrivers(filter);
  };

  useEffect(() => {
    if (allDrivers.length > 0) {
      const nextItems = allDrivers.slice(0, page * itemsPerPage);
      setVisibleDrivers(nextItems);
      setHasMore(nextItems.length < allDrivers.length);
    }
  }, [page, allDrivers]);

  const fetchMoreData = () => {
    if (visibleDrivers.length >= allDrivers.length) {
      setHasMore(false);
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const sendOrderStatus = async (order) => {
    const contact = order.phoneNumber.trim();
    const template1 = "delivery_customer";
    const name = order.name.trim();
    const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template1)}&Param=${encodeURIComponent(
      name
    )},${encodeURIComponent(order.orderId)},${encodeURIComponent(
      order.id.totalPrice.toFixed(2)
    )}&Name=${encodeURIComponent(name)}`;
    axios
      .get(url1)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);

    const template2 = "delivery_clients";
    const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(
      apiKey
    )}&Contact=8234012896&Template=${encodeURIComponent(
      template2
    )}&Param=${encodeURIComponent(order.orderId)},${encodeURIComponent(
      order.id.totalPrice.toFixed(2)
    )},${encodeURIComponent(name)},${encodeURIComponent(
      order.location.replaceAll(",", ";").trim()
    )},${encodeURIComponent(order.driverName)}&Name=${encodeURIComponent(
      name
    )}`;
    axios
      .get(url2)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
  };

  const updateOrderStatus = async (order, newStatus) => {
    try {
      await axios.patch(
        `${config.baseURL}/api/orders/orderId/${order.orderId}`,
        { status: newStatus }
      );
      sendOrderStatus(order);
      fetchDrivers();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const sendPaymentStatus = async (order) => {
    const contact = order.phoneNumber.trim();
    const template = "payment_customerr";
    const name = order.name.trim();
    const param = `${order.id.totalPrice.toFixed(2)},${
      order.orderId
    },${order.id.category.join("; ")},${
      order.id.garmentDetails.flat().join("; ") || "none"
    },${selectedPaymentMethod}`;
    const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${template}&Param=${encodeURIComponent(
      param
    )}&Name=${encodeURIComponent(name)}`;
    const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(
      apiKey
    )}&Contact=8234012896&Template=${template}&Param=${encodeURIComponent(
      param
    )}&Name=${encodeURIComponent(name)}`;
    axios
      .get(url1)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
    axios
      .get(url2)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
  };

  const handleConfirmPaymentMethod = async () => {
    const id = selectedDriver.orderId;
    try {
      const resp1 = await axios.post(
        `${config.baseURL}/api/orders/updatePaymentMode/${id}`,
        { paymentMode: selectedPaymentMethod }
      );
      if (resp1.status === 200)
        alert(
          `Payment Mode for Order ID ${id} has been changed to ${selectedPaymentMethod}.`
        );
      else alert(`Failed to update payment status for Order ID ${id}.`);
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the payment mode.");
    }
    try {
      const resp2 = await axios.post(
        `${config.baseURL}/api/orders/updatePaymentStatus/${id}`,
        { paymentStatus: selectedStatus }
      );
      if (resp2.status === 200) {
        alert(
          `Payment status for Order ID ${id} has been changed to ${selectedStatus}.`
        );
        sendPaymentStatus(selectedDriver);
      } else alert(`Failed to update payment status for Order ID ${id}.`);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the payment status.");
    }
    setShowPopup(false);
  };

  const handlePaymentStatusChange = (driver, newStatus) => {
    setSelectedDriver(driver);
    setSelectedStatus(newStatus);
    setShowPopup(true);
  };

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/api/route-location/routes`
      );
      setRoutesData(response.data || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const findRouteByLocation = (locationName) => {
    const route = routesData.find((route) =>
      route.locations.some(
        (location) => location.name.toLowerCase() === locationName.toLowerCase()
      )
    );
    return route ? route.routeName : "No route found";
  };

  const handleStatusChange = (order, e) => {
    const newStatus = e.target.value;
    const confirmed = window.confirm(
      `Are you sure you want to change the status to "${newStatus}"?`
    );
    if (confirmed) updateOrderStatus(order, newStatus);
  };

  useEffect(() => {
    fetchDrivers();
    fetchRoutes();
  }, []);

  const fetchApis = () => {
    fetchDrivers();
    fetchRoutes();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4">Driver Status</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={fetchApis}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Refresh
        </button>
        <div className="flex-1 min-w-[300px]">
          <div className="flex gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border border-gray-300 rounded p-2 shadow"
            >
              <option value="name">Customer Name</option>
              <option value="driverName">Driver Name</option>
              <option value="phoneNumber">Phone Number</option>
              <option value="orderId">Order ID</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchField}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div id="scrollableDiv" style={{ maxHeight: "70vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={visibleDrivers.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4">Loading more drivers...</div>
          }
          scrollableTarget="scrollableDiv"
        >
          {visibleDrivers?.map?.((driver) => (
            <div
              key={driver.orderId}
              className="border p-4 mb-4 shadow rounded"
            >
              <p>
                <strong>Customer:</strong> {driver.name}
              </p>
              <p>
                <strong>Order ID:</strong> {driver.orderId}
              </p>
              <p>
                <strong>Location:</strong> {driver.location}
              </p>
              <p>
                <strong>Route:</strong> {findRouteByLocation(driver.location)}
              </p>
              <p>
                <strong>Status:</strong> {driver.id.status}
              </p>

              <select
                onChange={(e) => handleStatusChange(driver, e)}
                className="mt-2 p-2 border rounded"
              >
                <option value="">Update Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => handlePaymentStatusChange(driver, "Paid")}
                className="ml-4 px-4 py-2 bg-purple-500 text-white rounded"
              >
                Mark Paid
              </button>
            </div>
          )) || <p>No drivers to show.</p>}
        </InfiniteScroll>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl">
            <h3 className="text-lg font-bold mb-2">Confirm Payment Method</h3>
            <select
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
              className="border p-2 mb-4 w-full"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmPaymentMethod}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverStatus;
