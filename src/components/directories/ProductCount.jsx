import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const processMapping = {
  1: "Inspection",
  2: "Packing",
  3: "Sorting",
  4: "Ironing",
};

const ProductCount = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/api/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleSeeMore = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.baseURL}/api/qr-process/${orderId}`);
      if (!response.data) {
        setSelectedOrder({ orderId, noProcesses: true });
      } else {
        setSelectedOrder(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSelectedOrder({ orderId, noProcesses: true });
    }
    setLoading(false);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4 mt-16">
      <input
        type="text"
        placeholder="Search by Order ID or Customer Name"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-x-auto overflow-y-auto max-h-96 shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="sticky top-0 bg-blue-500 text-white uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Mobile Number</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6">{order.orderId}</td>
                <td className="py-3 px-6">{order.name}</td>
                <td className="py-3 px-6">{order.phoneNumber}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleSeeMore(order.orderId)}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "See More"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Order Details - {selectedOrder.orderId}
            </h2>
            {selectedOrder.noProcesses ? (
              <p className="text-lg font-medium text-center text-gray-600">
                No QR process done yet.
              </p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Total Units: {selectedOrder.units}
                </p>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-200 text-black">
                    <tr>
                      <th className="py-3 px-6 text-left">Unit</th>
                      <th className="py-3 px-6 text-left">Inspection</th>
                      <th className="py-3 px-6 text-left">Packing</th>
                      <th className="py-3 px-6 text-left">Sorting</th>
                      <th className="py-3 px-6 text-left">Ironing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.processesPerUnit.map((unit) => {
                      // Map processes to their respective columns
                      let processStatus = { 1: "Not Done", 2: "Not Done", 3: "Not Done", 4: "Not Done" };
                      unit.processes.forEach((process) => {
                        if (processMapping[process.processNumber]) {
                          processStatus[process.processNumber] = `Done by ${process.userID.name}`;
                        }
                      });

                      return (
                        <tr key={unit.unitNumber} className="border-b border-gray-200">
                          <td className="py-3 px-6">{unit.unitNumber}</td>
                          <td className="py-3 px-6">{processStatus[1]}</td>
                          <td className="py-3 px-6">{processStatus[2]}</td>
                          <td className="py-3 px-6">{processStatus[3]}</td>
                          <td className="py-3 px-6">{processStatus[4]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCount;
