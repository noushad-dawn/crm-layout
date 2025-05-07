import React, { useState, useEffect } from "react";
import api from '../../api/axios';

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
      const response = await api.get(`api/orders`);
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
      const response = await api.get(`/api/drivers`);
      setDrivers(response.data || []);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const fetchNotes = async (orderId) => {
    try {
      const response = await api.get(`api/note/order/${orderId}`);
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/processes/order-journey`);
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
      await api.post(`api/orders/updatePaymentStatus/${orderId}`, {
        paymentStatus: status,
      });

      // Update payment method if status is Completed
      if (status === "Completed") {
        await api.post(`api/orders/updatePaymentMode/${orderId}`, {
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