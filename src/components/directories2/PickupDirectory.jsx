import React, { useState, useEffect } from "react";
import api from '../../api/axios';
import config from "../config";
import InfiniteScroll from "react-infinite-scroll-component";

const PickupDirectory = () => {
  const [pickups, setPickups] = useState([]); // All pickups from the backend
  const [filteredPickups, setFilteredPickups] = useState([]); // Filtered pickups based on search/date
  const [selectedDate, setSelectedDate] = useState("");
  const [searchRoute, setSearchRoute] = useState("");
  const [editingDateId, setEditingDateId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [visiblePickups, setVisiblePickups] = useState([]);
  const [hasMore, setHasMore] = useState(true); 
  const [page, setPage] = useState(0); 
  const pageSize = 10; 

  const statuses = ["Ready to be picked", "On route", "Cancelled", "Picked"];
  const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
  const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;

  useEffect(() => {
    // Fetch all pickups from the backend
    fetchPickup();
  }, []);

  useEffect(() => {
    // Update filtered pickups when search or date changes
    let filtered = pickups;

    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      filtered = filtered.filter((pickup) => {
        const pickupDate = new Date(pickup.date);
        return (
          pickupDate.getFullYear() === selectedDateObj.getFullYear() &&
          pickupDate.getMonth() === selectedDateObj.getMonth() &&
          pickupDate.getDate() === selectedDateObj.getDate()
        );
      });
    }

    if (searchRoute) {
      filtered = filtered.filter((pickup) =>
        pickup.route.toLowerCase().includes(searchRoute.toLowerCase())
      );
    }

    setFilteredPickups(filtered);
    setVisiblePickups(filtered.slice(0, pageSize)); // Reset visible pickups
    setPage(0); // Reset page to 0
    setHasMore(filtered.length > pageSize); // Update hasMore based on filtered data
  }, [selectedDate, searchRoute, pickups]);

  const fetchPickup = () => {
    api
      .get(`api/pickups`)
      .then((response) => setPickups(response.data))
      .catch((err) => console.error("Failed to fetch pickups:", err));
  };

  // Load more pickups for infinite scroll
  const loadMorePickups = () => {
    const nextPage = page + 1;
    const nextPickups = filteredPickups.slice(
      nextPage * pageSize,
      (nextPage + 1) * pageSize
    );

    if (nextPickups.length === 0) {
      setHasMore(false); // No more pickups to load
      return;
    }

    setVisiblePickups((prev) => [...prev, ...nextPickups]);
    setPage(nextPage);
  };

  const sendCancelMessage = async (name, contact) => {
    const template = "pickup_canceled";
    const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(
      name
    )}&Name=${encodeURIComponent(name)}`;
    api
      .get(url)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const sendOnRouteMessage = async (name, time, contact) => {
    const template = "pickup_cust";
    const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(
      name
    )},${encodeURIComponent(time)}&Name=${encodeURIComponent(name)}`;
    api
      .get(url)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleStatusChange = (pickup, newStatus) => {
    const id = pickup._id;
    const name = pickup.customerName;
    const contact = pickup.phoneNumber.trim();
    const time = pickup.timeslot;
    const confirm = window.confirm("Do you want to change?");
    if (!confirm) return;
    api
      .patch(`api/pickups/status/${id}`, { newStatus })
      .then((response) => {
        setConfirmationMessage("Status updated successfully!");
        if (newStatus === statuses[2]) {
          sendCancelMessage(name, contact);
        } else if (newStatus === statuses[1]) {
          sendOnRouteMessage(name, time, contact);
        }
        setTimeout(() => setConfirmationMessage(""), 2000);
        fetchPickup();
      })
      .catch((err) => console.error("Failed to update status:", err));
  };

  const handleEdit = (id, currentDate) => {
    setEditingDateId(id);
    setNewDate(new Date(currentDate).toISOString().split("T")[0]);
  };

  const sendRescheduleMessage = async (pickup) => {
    const contact = pickup.phoneNumber.trim();
    const template = "pickup_rescheduled";
    const name = pickup.customerName.trim();
    const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(
      name
    )},${encodeURIComponent(pickup.location.replace(",", ";"))},${encodeURIComponent(
      contact
    )}&Name=${encodeURIComponent(name)}`;
    api
      .get(url)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSave = (pickup) => {
    const id = pickup._id;
    api
      .patch(`api/pickups/reschedule/${id}`, { newDate })
      .then((response) => {
        setEditingDateId(null);
        sendRescheduleMessage(pickup);
        setNewDate("");
        setConfirmationMessage("Date updated successfully!");
        setTimeout(() => setConfirmationMessage(""), 2000);
        fetchPickup();
      })
      .catch((err) => console.error("Failed to update pickup date:", err));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Pickup Directory
      </h1>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={searchRoute}
          placeholder="Search by Route"
          onChange={(e) => setSearchRoute(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {confirmationMessage && (
        <div className="text-center mb-4 text-green-600 font-semibold">
          {confirmationMessage}
        </div>
      )}

      <div id="scrollableDiv" className="overflow-x-auto max-h-[70vh]">
        <InfiniteScroll
          dataLength={visiblePickups.length}
          next={loadMorePickups}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4 text-gray-500">
              Loading more pickups...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-gray-500 text-white sticky top-0">
              <tr>
                <th className="py-2 px-4 text-left">Customer Name</th>
                <th className="py-2 px-4 text-left">Phone Number</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">Route</th>
                <th className="py-2 px-4 text-left">Driver Name</th>
                <th className="py-2 px-4 text-left">Time Slot</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Reschedule</th>
              </tr>
            </thead>
            <tbody>
              {visiblePickups.map((pickup) => (
                <tr
                  key={pickup._id}
                  className="hover:bg-gray-100 transition border-b"
                >
                  <td className="py-2 px-4">{pickup.customerName}</td>
                  <td className="py-2 px-4">{pickup.phoneNumber}</td>
                  <td className="py-2 px-4">{pickup.address}</td>
                  <td className="py-2 px-4">{pickup.location}</td>
                  <td className="py-2 px-4">{pickup.route}</td>
                  <td className="py-2 px-4">{pickup.driverId?.name}</td>
                  <td className="py-2 px-4">{pickup.timeslot}</td>
                  <td className="py-2 px-4">
                    {new Date(pickup.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={pickup.status || statuses[0]}
                      onChange={(e) => handleStatusChange(pickup, e.target.value)}
                      className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    {editingDateId === pickup._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          onClick={() => handleSave(pickup)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(pickup._id, pickup.date)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PickupDirectory;