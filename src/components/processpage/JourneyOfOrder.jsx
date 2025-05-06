// import React, { useState, useEffect } from "react";
// import config from "../config";
// import axios from "axios";

// const JourneyOfOrderTable = () => {
//   const [journeyData, setJourneyData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // State for the search input
//   const [drivers, setDrivers] = useState([]);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [notes, setNotes] = useState({});
//   const processMap = {
//     process1: "Inspection",
//     process2: "washing",
//     process3: "sorting",
//     process4: "iron",
//   };

//   useEffect(() => {
//     fetchData();
//     fetchDrivers();
//   }, []);

//   const openNoteModal = (orderId) => {
//     fetchNotes(orderId);
//     setIsNoteModalOpen(true);
//   };

//   const fetchDrivers = async () => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/drivers/status`);
//       setDrivers(response.data || []);
//     } catch (error) {
//       console.error("Error fetching driver data:", error);
//     }
//   };

//   const fetchNotes = async (orderId) => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/note/order/${orderId}`);
//       setNotes(Array.isArray(response.data) ? response.data : []); // Ensure the data is an array
//     } catch (error) {
//       console.error("Error fetching notes", error);
//     }
//   };

//   const fetchData = () => {
//     fetch(`${config.baseURL}/api/processes/order-journey`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setJourneyData(data); // Set fetched data into state
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the data:", error);
//         setJourneyData([]);
//       });
//   };

//   const filteredData = searchTerm
//     ? journeyData.filter((item) =>
//         item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : []; // If no search term, display all orders

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Journey of Orders</h2>

//       {/* Search Input */}
//       <div className="mb-4">
//         <input
//           type="text"
//           className="px-4 py-2 border border-gray-300 rounded"
//           placeholder="Search by Order ID"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 border border-gray-300">
//             <th className="py-2 px-4 border border-gray-300">Order ID</th>
//             <th className="py-2 px-4 border border-gray-300">
//               Current Process
//             </th>
//             <th className="py-2 px-4 border border-gray-300">Inspection</th>
//             <th className="py-2 px-4 border border-gray-300">Washing</th>
//             <th className="py-2 px-4 border border-gray-300">Sorting</th>
//             <th className="py-2 px-4 border border-gray-300">Iron</th>
//             <th className="py-2 px-4 border border-gray-300">Driver Details</th>
//             <th className="py-2 px-4 border border-gray-300">Notes</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((item) => (
//               <tr
//                 key={item.orderId}
//                 className="hover:bg-gray-100 border border-gray-300"
//               >
//                 <td className="py-2 px-4 border border-gray-300">
//                   {item.orderId}
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   {processMap[item.currentProcess] || "No process"}
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <p>
//                     <strong>Time:</strong>{" "}
//                     {item.process.process1.timing
//                       ? new Date(item.process.process1.timing).toLocaleString()
//                       : "null"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.process.process1.status}
//                   </p>
//                   <p>
//                     <strong>User:</strong> {item.process.process1.userId}
//                   </p>
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <p>
//                     <strong>Time:</strong>{" "}
//                     {item.process.process2.timing
//                       ? new Date(item.process.process2.timing).toLocaleString()
//                       : "null"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.process.process2.status}
//                   </p>
//                   <p>
//                     <strong>User:</strong> {item.process.process2.userId}
//                   </p>
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <p>
//                     <strong>Time:</strong>{" "}
//                     {item.process.process3.timing
//                       ? new Date(item.process.process3.timing).toLocaleString()
//                       : "null"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.process.process3.status}
//                   </p>
//                   <p>
//                     <strong>User:</strong> {item.process.process3.userId}
//                   </p>
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <p>
//                     <strong>Time:</strong>{" "}
//                     {item.process.process4.timing
//                       ? new Date(item.process.process4.timing).toLocaleString()
//                       : "null"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.process.process4.status}
//                   </p>
//                   <p>
//                     <strong>User:</strong> {item.process.process4.userId}
//                   </p>
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <p>
//                     <strong>Time: </strong>
//                     {drivers.find((driver) => driver.orderId === item.orderId)
//                       ?.createdAt
//                       ? new Date(
//                           drivers.find(
//                             (driver) => driver.orderId === item.orderId
//                           )?.createdAt
//                         ).toLocaleString()
//                       : "N/A"}
//                   </p>
//                   <p>
//                     <strong>Status: </strong>
//                     {drivers.find((driver) => driver.orderId === item.orderId)
//                       ?.status || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Driver: </strong>
//                     {drivers.find((driver) => driver.orderId === item.orderId)
//                       ?.driverName || "N/A"}
//                   </p>
//                 </td>
//                 <td className="py-2 px-4 border border-gray-300">
//                   <button
//                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                     onClick={() => openNoteModal(item.orderId)} // Pass the entire order object
//                   >
//                     View Notes
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : searchTerm === "" ? (
//             <tr>
//               <td
//                 colSpan="7"
//                 className="py-4 text-center border border-gray-300"
//               >
//                 Search the Orders
//               </td>
//             </tr>
//           ) : (
//             <tr>
//               <td
//                 colSpan="7"
//                 className="py-4 text-center border border-gray-300"
//               >
//                 No Orders Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
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
//                     {/* <button
//                       // onClick={() => handleDelete(note._id)} // You'll need to define this function
//                       className="text-red-500 hover:text-red-700 focus:outline-none font-semibold"
//                     >
//                       Delete
//                     </button> */}
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
//             {/* <button onClick={setIsNoteModalOpen(false)}>close</button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JourneyOfOrderTable;
import React, { useState, useEffect } from "react";
import config from "../config";
import axios from "axios";

const JourneyOfOrderTable = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("Pending");
  const [isLoading, setIsLoading] = useState(false);
  
  const processMap = {
    process1: "Inspection",
    process2: "Washing",
    process3: "Sorting",
    process4: "Ironing",
  };

  useEffect(() => {
    fetchData();
    fetchDrivers();
    fetchPaymentStatuses();
  }, []);

  const fetchPaymentStatuses = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/orders`);
      const statusMap = {};
      response.data.forEach(order => {
        statusMap[order.orderId] = {
          paymentStatus: order.paymentStatus || "Pending",
          paymentMode: order.mode || "Cash"
        };
      });
      setPaymentStatuses(statusMap);
    } catch (error) {
      console.error("Error fetching payment statuses:", error);
    }
  };

  const openNoteModal = async (orderId) => {
    try {
      setIsLoading(true);
      await fetchNotes(orderId);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.error("Error opening note modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/drivers`);
      setDrivers(response.data || []);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const fetchNotes = async (orderId) => {
    try {
      const response = await axios.get(`${config.baseURL}/api/note/order/${orderId}`);
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.baseURL}/api/processes/order-journey`);
      setJourneyData(response.data || []);
    } catch (error) {
      console.error("Error fetching journey data:", error);
      setJourneyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentStatusChange = (orderId, newStatus) => {
    const order = journeyData.find(item => item.orderId === orderId);
    setSelectedOrder(order);
    setSelectedPaymentStatus(newStatus);
    
    if (newStatus === "Completed") {
      setShowPaymentModal(true);
    } else {
      updatePaymentStatus(orderId, newStatus, paymentStatuses[orderId]?.paymentMode || "Cash");
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const updatePaymentStatus = async (orderId, status, method) => {
    try {
      setIsLoading(true);
      
      // Update payment status
      await axios.post(`${config.baseURL}/api/orders/updatePaymentStatus/${orderId}`, {
        paymentStatus: status,
      });

      // Update payment method if status is Completed
      if (status === "Completed") {
        await axios.post(`${config.baseURL}/api/orders/updatePaymentMode/${orderId}`, {
          paymentMode: method,
        });
      }

      // Update local state immediately for better UX
      setPaymentStatuses(prev => ({
        ...prev,
        [orderId]: {
          paymentStatus: status,
          paymentMode: status === "Completed" ? method : prev[orderId]?.paymentMode || "Cash"
        }
      }));

      // Refresh data from server
      await Promise.all([fetchPaymentStatuses(), fetchDrivers()]);
      
      alert(`Payment status for Order ID ${orderId} has been updated to ${status}`);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    if (selectedOrder) {
      updatePaymentStatus(selectedOrder.orderId, selectedPaymentStatus, selectedPaymentMethod);
      setShowPaymentModal(false);
    }
  };

  const filteredData = searchTerm
    ? journeyData.filter((item) =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Journey of Orders</h2>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded w-64"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => {
            fetchData();
            fetchDrivers();
            fetchPaymentStatuses();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 border border-gray-300">
              <th className="py-2 px-4 border border-gray-300">Order ID</th>
              <th className="py-2 px-4 border border-gray-300">Current Process</th>
              <th className="py-2 px-4 border border-gray-300">Inspection</th>
              <th className="py-2 px-4 border border-gray-300">Washing</th>
              <th className="py-2 px-4 border border-gray-300">Sorting</th>
              <th className="py-2 px-4 border border-gray-300">Ironing</th>
              <th className="py-2 px-4 border border-gray-300">Driver Details</th>
              <th className="py-2 px-4 border border-gray-300">Payment Status</th>
              <th className="py-2 px-4 border border-gray-300">Payment Mode</th>
              <th className="py-2 px-4 border border-gray-300">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const driverInfo = drivers.find(driver => driver.orderId === item.orderId);
                const paymentInfo = paymentStatuses[item.orderId] || {};
                
                return (
                  <tr
                    key={item.orderId}
                    className="hover:bg-gray-100 border border-gray-300"
                  >
                    <td className="py-2 px-4 border border-gray-300">
                      {item.orderId}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {processMap[item.currentProcess] || "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <p><strong>Time:</strong> {formatDateTime(item.process.process1.timing)}</p>
                      <p><strong>Status:</strong> {item.process.process1.status || "N/A"}</p>
                      <p><strong>User:</strong> {item.process.process1.userId || "N/A"}</p>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <p><strong>Time:</strong> {formatDateTime(item.process.process2.timing)}</p>
                      <p><strong>Status:</strong> {item.process.process2.status || "N/A"}</p>
                      <p><strong>User:</strong> {item.process.process2.userId || "N/A"}</p>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <p><strong>Time:</strong> {formatDateTime(item.process.process3.timing)}</p>
                      <p><strong>Status:</strong> {item.process.process3.status || "N/A"}</p>
                      <p><strong>User:</strong> {item.process.process3.userId || "N/A"}</p>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <p><strong>Time:</strong> {formatDateTime(item.process.process4.timing)}</p>
                      <p><strong>Status:</strong> {item.process.process4.status || "N/A"}</p>
                      <p><strong>User:</strong> {item.process.process4.userId || "N/A"}</p>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <p><strong>Time:</strong> {formatDateTime(driverInfo?.createdAt)}</p>
                      <p><strong>Status:</strong> {driverInfo?.status || "N/A"}</p>
                      <p><strong>Driver:</strong> {driverInfo?.driverName || "N/A"}</p>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <select
                        value={paymentInfo.paymentStatus || "Pending"}
                        onChange={(e) => handlePaymentStatusChange(item.orderId, e.target.value)}
                        className="border border-gray-300 rounded p-1"
                        disabled={paymentInfo.paymentStatus === 'Completed'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {paymentInfo.paymentMode || "Cash"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => openNoteModal(item.orderId)}
                        disabled={isLoading}
                      >
                        View Notes
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : searchTerm ? (
              <tr>
                <td colSpan="10" className="py-4 text-center border border-gray-300">
                  No orders found matching your search
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center border border-gray-300">
                  You can search for the OrderId
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 min-w-[300px]">
            <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>
            <div className="mb-4">
              <p className="mb-2"><strong>Order ID:</strong> {selectedOrder?.orderId}</p>
              <p className="mb-4"><strong>Status:</strong> {selectedPaymentStatus}</p>
              
              <label className="block mb-2 font-medium">Payment Method:</label>
              <select
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 min-w-[300px] max-w-[600px] relative max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order Notes</h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                        <span>By: {note.createdBy?.name || "Unknown"}</span>
                      </div>
                      <p className="text-gray-800">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No notes available for this order.
                </p>
              )}
            </div>
            
            <div className="border-t pt-3">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyOfOrderTable;