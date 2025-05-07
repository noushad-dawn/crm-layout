import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../../api/axios";

const ProductCount = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [processMapping, setProcessMapping] = useState({});
  const [processSteps, setProcessSteps] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch process flow first
        const processFlowResponse = await api.get(`${config.baseURL}/api/processflow`);
        if (processFlowResponse.data.flow) {
          const mapping = {};
          const steps = processFlowResponse.data.flow.steps.map((step, index) => {
            mapping[index + 1] = step.stepName;
            return {
              id: index + 1,
              name: step.stepName,
              description: step.description,
            };
          });
          setProcessMapping(mapping);
          setProcessSteps(steps);
        }

        // Then fetch orders
        const ordersResponse = await api.get(`${config.baseURL}/api/orders`);
        setOrders(ordersResponse.data);
        setVisibleOrders(ordersResponse.data.slice(0, pageSize));
        setHasMore(ordersResponse.data.length > pageSize);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSeeMore = async (orderId) => {
    setLoading(true);
    try {
      // Fetch process details
      const response = await api.get(`${config.baseURL}/api/qr-process/${orderId}`);
      // Find order details from orders state
      const orderDetails = orders.find((order) => order.orderId === orderId);
      if (!response.data) {
        setSelectedOrder({ orderId, noProcesses: true, ...orderDetails });
      } else {
        setSelectedOrder({ ...response.data.order, ...orderDetails });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Fallback to order details from orders state
      const orderDetails = orders.find((order) => order.orderId === orderId);
      setSelectedOrder({ orderId, noProcesses: true, ...orderDetails });
    }
    setLoading(false);
  };

  const filterOrders = (orders, searchTerm) => {
    return orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const loadMoreOrders = () => {
    const nextPage = page + 1;
    const nextOrders = filterOrders(orders, searchTerm).slice(
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

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filtered = filterOrders(orders, searchTerm);
    setVisibleOrders(filtered.slice(0, pageSize));
    setPage(0);
    setHasMore(filtered.length > pageSize);
  };

  // Function to generate table headers based on process steps
  const renderProcessHeaders = () => {
    return processSteps.map((step) => (
      <th key={step.id} className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
        {step.description}
      </th>
    ));
  };

  // Function to render process status for each unit
  const renderProcessStatus = (unit) => {
    let processStatus = {};
    // Initialize all processes as "Not Done"
    processSteps.forEach((step) => {
      processStatus[step.id] = "Not Done";
    });

    // Update with actual status if process exists
    if (unit.processes) {
      unit.processes.forEach((process) => {
        if (processMapping[process.processNumber]) {
          processStatus[process.processNumber] = `Done by ${process.userID.name}`;
        }
      });
    }

    return processSteps.map((step) => (
      <td key={step.id} className="py-3 px-6 text-sm text-gray-600">
        {processStatus[step.id]}
      </td>
    ));
  };

  // Function to calculate total units safely
  const getTotalUnits = (units) => {
    if (Array.isArray(units)) {
      return units.reduce((sum, num) => sum + Number(num), 0);
    }
    return Number(units) || "N/A";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div id="scrollableDiv" className="overflow-x-auto max-h-[500px] bg-white rounded-lg shadow-md">
        <InfiniteScroll
          dataLength={visibleOrders.length}
          next={loadMoreOrders}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4">
              <svg className="animate-spin h-5 w-5 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-500">Loading more orders...</span>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm uppercase">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">Order ID</th>
                <th className="py-4 px-6 text-left font-semibold">Customer Name</th>
                <th className="py-4 px-6 text-left font-semibold">Mobile Number</th>
                <th className="py-4 px-6 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`hover:bg-gray-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-4 px-6 text-sm text-gray-700">{order.orderId}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{order.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{order.phoneNumber}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleSeeMore(order.orderId)}
                      disabled={loading}
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        "See More"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Details - {selectedOrder.orderId}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold text-gray-600">Customer Name</p>
                <p className="text-gray-800">{selectedOrder.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Phone Number</p>
                <p className="text-gray-800">{selectedOrder.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Address</p>
                <p className="text-gray-800">{selectedOrder.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Location</p>
                <p className="text-gray-800">{selectedOrder.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Category</p>
                <p className="text-gray-800">{selectedOrder.category?.join(", ") || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Products</p>
                <p className="text-gray-800">{selectedOrder.products?.join(", ") || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Units</p>
                <p className="text-gray-800">{getTotalUnits(selectedOrder.units)}</p>
              </div>
              <div>
                <p className="text-sm CARfont-semibold text-gray-600">Date of Order</p>
                <p className="text-gray-800">{selectedOrder.dateOfOrder ? new Date(selectedOrder.dateOfOrder).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Date of Delivery</p>
                <p className="text-gray-800">{selectedOrder.dateOfDelivery ? new Date(selectedOrder.dateOfDelivery).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Payment Mode</p>
                <p className="text-gray-800">{selectedOrder.mode || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Payment Status</p>
                <p className="text-gray-800">{selectedOrder.paymentStatus || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Price</p>
                <p className="text-gray-800">${selectedOrder.totalPrice || "0"}</p>
              </div>
            
            </div>
            {selectedOrder.noProcesses ? (
              <p className="text-lg font-medium text-center text-gray-500">
                No QR process done yet.
              </p>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Total Units: {selectedOrder.units}
                </p>
                <div className="max-h-[300px] overflow-y-auto overflow-x-auto rounded-lg shadow-sm">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Unit</th>
                        {renderProcessHeaders()}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.processesPerUnit.map((unit, index) => (
                        <tr key={unit.unitNumber} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition duration-150`}>
                          <td className="py-3 px-6 text-sm text-gray-600">{unit.unitNumber}</td>
                          {renderProcessStatus(unit)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCount;