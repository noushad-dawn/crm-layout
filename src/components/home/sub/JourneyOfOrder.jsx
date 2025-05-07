import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";

const JourneyOfOrderTable = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("Pending");
  const [processDetails, setProcessDetails] = useState(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [processSteps, setProcessSteps] = useState([]);
  const [processMapping, setProcessMapping] = useState({});

  useEffect(() => {
    fetchData();
    fetchDrivers();
    fetchPaymentStatuses();
    fetchProcessFlow();
  }, []);

  const fetchProcessFlow = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/processflow`);
      if (response.data.flow) {
        const mapping = {};
        const steps = response.data.flow.steps.map((step, index) => {
          mapping[`process${index + 1}`] = step.stepName;
          return {
            id: index + 1,
            name: step.stepName,
            description: step.description,
          };
        });
        setProcessMapping(mapping);
        setProcessSteps(steps);
      }
    } catch (error) {
      console.error("Error fetching process flow:", error);
    }
  };

  const fetchPaymentStatuses = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/drivers/status`);
      const statusMap = {};
      response.data.forEach((driver) => {
        statusMap[driver.orderId] = {
          paymentStatus: driver.id?.paymentStatus || "Pending",
          paymentMode: driver.id?.mode || "Cash",
        };
      });
      setPaymentStatuses(statusMap);
    } catch (error) {
      console.error("Error fetching payment statuses:", error);
    }
  };

  const openNoteModal = (orderId) => {
    fetchNotes(orderId);
    setIsNoteModalOpen(true);
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/drivers/status`);
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

  const fetchData = () => {
    fetch(`${config.baseURL}/api/processes/order-journey`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setJourneyData(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setJourneyData([]);
      });
  };

  const handlePaymentStatusChange = (orderId, newStatus) => {
    const order = journeyData.find((item) => item.orderId === orderId);
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
      await axios.post(`${config.baseURL}/api/orders/updatePaymentStatus/${orderId}`, {
        paymentStatus: status,
      });

      if (status === "Completed") {
        await axios.post(`${config.baseURL}/api/orders/updatePaymentMode/${orderId}`, {
          paymentMode: method,
        });
      }

      fetchPaymentStatuses();
      fetchDrivers();

      alert(`Payment status for Order ID ${orderId} has been updated to ${status}`);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  const handleConfirmPayment = () => {
    if (selectedOrder) {
      updatePaymentStatus(selectedOrder.orderId, selectedPaymentStatus, selectedPaymentMethod);
      setShowPaymentModal(false);
    }
  };

  const handleSeeProcessDetails = async (orderId) => {
    try {
      const response = await axios.get(`${config.baseURL}/api/qr-process/${orderId}`);
      if (!response.data) {
        setProcessDetails({ orderId, noProcesses: true });
      } else {
        setProcessDetails(response.data.order);
      }
      setIsProcessModalOpen(true);
    } catch (error) {
      console.error("Error fetching process details:", error);
      setProcessDetails({ orderId, noProcesses: true });
      setIsProcessModalOpen(true);
    }
  };

  const renderProcessHeaders = () => {
    return processSteps.map((step) => (
      <th key={step.id} className="py-3 px-6 text-left">
        {step.description}
      </th>
    ));
  };

  const renderProcessStatus = (unit) => {
    let processStatus = {};
    processSteps.forEach((step) => {
      processStatus[step.id] = "Not Done";
    });

    if (unit.processes) {
      unit.processes.forEach((process) => {
        if (processMapping[`process${process.processNumber}`]) {
          processStatus[process.processNumber] = `Done by ${process.userID.name}`;
        }
      });
    }

    return processSteps.map((step) => (
      <td key={step.id} className="py-3 px-6">
        {processStatus[step.id]}
      </td>
    ));
  };

  const filteredData = searchTerm
    ? journeyData.filter((item) =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Journey of Orders</h2>

      <div className="mb-4">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th className="py-2 px-4 border border-gray-300">Order ID</th>
            <th className="py-2 px-4 border border-gray-300">Current Process</th>
            <th className="py-2 px-4 border border-gray-300">Process Details</th>
            <th className="py-2 px-4 border border-gray-300">Driver Details</th>
            <th className="py-2 px-4 border border-gray-300">Payment Status</th>
            <th className="py-2 px-4 border border-gray-300">Payment Mode</th>
            <th className="py-2 px-4 border border-gray-300">Notes</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr
                key={item.orderId}
                className="hover:bg-gray-100 border border-gray-300"
              >
                <td className="py-2 px-4 border border-gray-300">
                  {item.orderId}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {processMapping[item.currentProcess] || "No process"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleSeeProcessDetails(item.orderId)}
                  >
                    Process Details
                  </button>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <p>
                    <strong>Time: </strong>
                    {drivers.find((driver) => driver.orderId === item.orderId)
                      ?.createdAt
                      ? new Date(
                          drivers.find(
                            (driver) => driver.orderId === item.orderId
                          )?.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    {drivers.find((driver) => driver.orderId === item.orderId)
                      ?.status || "N/A"}
                  </p>
                  <p>
                    <strong>Driver: </strong>
                    {drivers.find((driver) => driver.orderId === item.orderId)
                      ?.driverName || "N/A"}
                  </p>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <select
                    value={paymentStatuses[item.orderId]?.paymentStatus || "Pending"}
                    onChange={(e) => handlePaymentStatusChange(item.orderId, e.target.value)}
                    className="border border-gray-300 rounded p-1"
                    disabled={
                      drivers.find((driver) => driver.orderId === item.orderId)?.id?.paymentStatus === "Completed"
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {paymentStatuses[item.orderId]?.paymentMode || "Cash"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => openNoteModal(item.orderId)}
                  >
                    View Notes
                  </button>
                </td>
              </tr>
            ))
          ) : searchTerm === "" ? (
            <tr>
              <td
                colSpan="7"
                className="py-4 text-center border border-gray-300"
              >
                Search the Orders
              </td>
            </tr>
          ) : (
            <tr>
              <td
                colSpan="7"
                className="py-4 text-center border border-gray-300"
              >
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
            <div className="mb-4">
              <label className="block mb-2">Payment Method:</label>
              <select
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
                className="border rounded px-2 py-1 w-full"
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
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
            <h3 className="text-xl font-semibold mb-4">Notes for Order</h3>
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
              ×
            </button>
          </div>
        </div>
      )}

      {/* Process Details Modal */}
      {isProcessModalOpen && processDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4">
              Process Details - {processDetails.orderId}
            </h2>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setIsProcessModalOpen(false)}
            >
              Close
            </button>
            </div>
            {processDetails.noProcesses ? (
              <p className="text-lg font-medium text-center text-gray-600">
                No QR process done yet.
              </p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Total Units: {processDetails.units}
                </p>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-200 text-black">
                    <tr>
                      <th className="py-3 px-6 text-left">Unit</th>
                      {renderProcessHeaders()}
                    </tr>
                  </thead>
                  <tbody>
                    {processDetails.processesPerUnit.map((unit) => (
                      <tr key={unit.unitNumber} className="border-b border-gray-200">
                        <td className="py-3 px-6">{unit.unitNumber}</td>
                        {renderProcessStatus(unit)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyOfOrderTable;