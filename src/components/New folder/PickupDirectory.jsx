// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../config";

// const PickupDirectory = () => {
//   const [pickups, setPickups] = useState([]);
//   const [filteredPickups, setFilteredPickups] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [searchRoute, setSearchRoute] = useState("");
//   const [editingDateId, setEditingDateId] = useState(null);
//   const [newDate, setNewDate] = useState("");
//   const [confirmationMessage, setConfirmationMessage] = useState("");
//   const statuses = ["Ready to be picked", "On route", "Cancelled", "Picked"];
//   const licenseNumber = import.meta.env.REACT_APP_WHATSAPP_LICENSE_NUMBER;
//   const apiKey = import.meta.env.REACT_APP_WHATSAPP_API_KEY;

//   useEffect(() => {
//     fetchPickup();
//   }, [selectedDate, searchRoute]);

//   const fetchPickup = () => {
//     let url = `${config.baseURL}/api/pickups`;

//     const params = new URLSearchParams();
//     if (selectedDate) {
//       const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
//       params.append('date', formattedDate);
//     }
//     if (searchRoute) params.append('route', searchRoute);

//     if (params.toString()) url += `?${params.toString()}`;

//     axios
//       .get(url)
//       .then((response) => {
//         setPickups(response.data);
//         setFilteredPickups(response.data);
//       })
//       .catch((err) => console.error("Failed to fetch pickups:", err));
//   }

//   const sendCencelMessage = async(name, contact) => {
//       const template = 'pickup_canceled';
//       const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(name)}&Name=${encodeURIComponent(name)}`;
//       axios
//         .get(url)
//         .then((response) => {
//           console.log('Response:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//   }

//   const sendOnRouteMessage = async(name, time, contact) => {
//       const template = 'pickup_cust';
//       const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(name)},${encodeURIComponent(time)}&Name=${encodeURIComponent(name)}`;
//       axios
//         .get(url)
//         .then((response) => {
//           console.log('Response:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//   }

//   const handleStatusChange = (pickup, newStatus) => {
//     const id = pickup._id;
//     const name = pickup.customerName;
//     const contact = pickup.phoneNumber.trim();
//     const time = pickup.timeslot;
//     const confirm = window.confirm('do you want to change');
//     if(!confirm)return;
//     axios
//       .patch(`${config.baseURL}/api/pickups/status/${id}`, { newStatus })
//       .then((response) => {
//         setConfirmationMessage("Status updated successfully!");
//         if(newStatus === statuses[2]){
//           sendCencelMessage(name,contact);
//         }
//         else if(newStatus === statuses[1]){
//           sendOnRouteMessage(name, time, contact);
//         }
//         setTimeout(() => setConfirmationMessage(""), 2000);
//         fetchPickup();
//       })
//       .catch((err) => console.error("Failed to update status:", err));
//   };

//   const handleEdit = (id, currentDate) => {
//     setEditingDateId(id);
//     setNewDate(new Date(currentDate).toISOString().split("T")[0]);
//   };

//   const sendRescheduleMessage = async (pickup) => {
//       const contact = pickup.phoneNumber.trim();
//       const template = 'pickup_rescheduled';
//       const name = pickup.customerName.trim();
//       const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(name)},${encodeURIComponent(pickup.location.replace(',',';'))},${encodeURIComponent(contact)}&Name=${encodeURIComponent(name)}`;
//       axios
//         .get(url)
//         .then((response) => {
//           console.log('Response:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//   }

//   const handleSave = (pickup) => {
//     const id = pickup._id;
//     axios
//       .patch(`${config.baseURL}/api/pickups/reschedule/${id}`, { newDate })
//       .then((response) => {
//         setEditingDateId(null);
//         sendRescheduleMessage(pickup);
//         setNewDate("");
//         setConfirmationMessage("Date updated successfully!");
//         setTimeout(() => setConfirmationMessage(""), 2000);
//         fetchPickup();
//       })
//       .catch((err) => console.error("Failed to update pickup date:", err));
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6 mt-10">
//       <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
//         Pickup Directory
//       </h1>

//       <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           type="text"
//           value={searchRoute}
//           placeholder="Search by Route"
//           onChange={(e) => setSearchRoute(e.target.value)}
//           className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//       </div>

//       {confirmationMessage && (
//         <div className="text-center mb-4 text-green-600 font-semibold">
//           {confirmationMessage}
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="w-full table-auto bg-white shadow-md rounded-lg">
//           <thead className="bg-gray-500 text-white">
//             <tr>
//               <th className="py-2 px-4 text-left">Customer Name</th>
//               <th className="py-2 px-4 text-left">Phone Number</th>
//               <th className="py-2 px-4 text-left">Address</th>
//               <th className="py-2 px-4 text-left">Location</th>
//               <th className="py-2 px-4 text-left">Route</th>
//               <th className="py-2 px-4 text-left">Driver Name</th>
//               <th className="py-2 px-4 text-left">Time Slot</th>
//               <th className="py-2 px-4 text-left">Date</th>
//               <th className="py-2 px-4 text-left">Status</th>
//               <th className="py-2 px-4 text-left">Reschedule</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(filteredPickups.length > 0 ? filteredPickups : pickups).map(
//               (pickup) => (
//                 <tr
//                   key={pickup._id}
//                   className="hover:bg-gray-100 transition border-b"
//                 >
//                   <td className="py-2 px-4">{pickup.customerName}</td>
//                   <td className="py-2 px-4">{pickup.phoneNumber}</td>
//                   <td className="py-2 px-4">{pickup.address}</td>
//                   <td className="py-2 px-4">{pickup.location}</td>
//                   <td className="py-2 px-4">{pickup.route}</td>
//                   <td className="py-2 px-4">{pickup.driverId?.name}</td>
//                   <td className="py-2 px-4">{pickup.timeslot}</td>

//                   <td className="py-2 px-4">
//                     {new Date(pickup.date).toLocaleDateString()}
//                   </td>
//                   <td className="py-2 px-4">
//                     <select
//                       value={pickup.status || statuses[0]}
//                       onChange={(e) =>
//                         handleStatusChange(pickup, e.target.value)
//                       }
//                       className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     >
//                       {statuses.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="py-2 px-4">
//                     {editingDateId === pickup._id ? (
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="date"
//                           value={newDate}
//                           onChange={(e) => setNewDate(e.target.value)}
//                           className="p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         <button
//                           onClick={() => handleSave(pickup)}
//                           className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
//                         >
//                           Save
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(pickup._id, pickup.date)}
//                         className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
//                       >
//                         Edit
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PickupDirectory;

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import config from "../config";

const PickupDirectory = () => {
  const [allPickups, setAllPickups] = useState([]);
  const [visiblePickups, setVisiblePickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchRoute, setSearchRoute] = useState("");
  const [editingDateId, setEditingDateId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["Ready to be picked", "On route", "Cancelled", "Picked"];
  const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
  const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;

  useEffect(() => {
    fetchPickup();
  }, [selectedDate, searchRoute]);

  const fetchPickup = () => {
    let url = `${config.baseURL}/api/pickups`;

    const params = new URLSearchParams();
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      params.append("date", formattedDate);
    }
    if (searchRoute) params.append("route", searchRoute);

    if (params.toString()) url += `?${params.toString()}`;

    axios
      .get(url)
      .then((response) => {
        setAllPickups(response.data);
        setFilteredPickups(response.data);
        setVisiblePickups(response.data.slice(0, itemsPerPage));
        setPage(1);
        setHasMore(response.data.length > itemsPerPage);
      })
      .catch((err) => console.error("Failed to fetch pickups:", err));
  };

  // Load more data when page changes
  useEffect(() => {
    const dataToShow =
      filteredPickups.length > 0 ? filteredPickups : allPickups;
    const nextItems = dataToShow.slice(0, page * itemsPerPage);
    setVisiblePickups(nextItems);
    setHasMore(nextItems.length < dataToShow.length);
  }, [page, allPickups, filteredPickups]);

  const fetchMoreData = () => {
    if (
      visiblePickups.length >=
      (filteredPickups.length > 0 ? filteredPickups.length : allPickups.length)
    ) {
      setHasMore(false);
      return;
    }
    setPage((prevPage) => prevPage + 1);
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
    axios
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
    axios
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
    const confirm = window.confirm("Do you want to change the status?");
    if (!confirm) return;

    axios
      .patch(`${config.baseURL}/api/pickups/status/${id}`, { newStatus })
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
    )},${encodeURIComponent(
      pickup.location.replace(",", ";")
    )},${encodeURIComponent(contact)}&Name=${encodeURIComponent(name)}`;
    axios
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
    axios
      .patch(`${config.baseURL}/api/pickups/reschedule/${id}`, { newDate })
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

      <div id="scrollableDiv" style={{ maxHeight: "70vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={visiblePickups.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4">Loading more pickups...</div>
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
              {Array.isArray(visiblePickups) && visiblePickups.length > 0 ? (
                visiblePickups.map((pickup) => (
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
                        onChange={(e) =>
                          handleStatusChange(pickup, e.target.value)
                        }
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
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No pickups available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PickupDirectory;
