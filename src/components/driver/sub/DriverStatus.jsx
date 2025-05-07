import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import api from '../../../api/axios';

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
        response = await api.get(
          `api/drivers/status/filter`,
          { params: filter }
        );
      } else {
        response = await api.get(`api/drivers/status`);
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
    api
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
    api
      .get(url2)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
  };

  const updateOrderStatus = async (order, newStatus) => {
    try {
      await api.patch(
        `api/orders/orderId/${order.orderId}`,
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
    api
      .get(url1)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
    api
      .get(url2)
      .then((r) => console.log("Response:", r.data))
      .catch(console.error);
  };

  const handleConfirmPaymentMethod = async () => {
    const id = selectedDriver.orderId;
    try {
      const resp1 = await api.post(
        `api/orders/updatePaymentMode/${id}`,
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
      const resp2 = await api.post(
        `api/orders/updatePaymentStatus/${id}`,
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
      const response = await api.get(
        `api/route-location/routes`
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
