import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from '../../api/axios';


import config from "../config";
import InfiniteScroll from 'react-infinite-scroll-component';

const CurrentStatus = () => {
  const [data, setData] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(); // Track selected user for assignment
  const [users, setUsers] = useState([]);
  const [showCrateModal, setShowCrateModal] = useState(false);
  const [selectedCrate, setSelectedCrate] = useState(""); 
  const [selectedProcess, setSelectedProcess] = useState("");
  // const [listOrders, setListOrders] = useState([]); // State to store crate orders
  const [crates, setCrates] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [crateSearch, setCrateSearch] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [selectedTATRange, setSelectedTATRange] = useState(""); // empty means no filter
  const [notes, setNotes] = useState({}); // Stores notes for each order
  const [newNote, setNewNote] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [userID, setUserID] = useState(null);
  const [unit, setUnit] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;


  // const [userName, setUserName] = useState(null);
  // Handler to update the search query state

  const openNoteModal = (order) => {
    setSelectedOrder(order._id);
    setUserID(order.userID || "admin-crm");
    // setUserName(order.userName);
    fetchNotes(order._id);
    setIsNoteModalOpen(true);
  };

  useEffect(() => {
    console.log("Notes updated:");
  }, [notes]);

  const fetchNotes = async (orderId) => {
    try {
      const response = await api.get(`api/note/${orderId}`);
      setNotes(response.data); // Ensure the data is an array
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const addNote = async (selectedOrder) => {
    if (!newNote) return; // Don't submit if the newNote is empty
    try {
      const response = await api.post(
        `api/note/add/${selectedOrder}`,
        {
          content: newNote,
          userID: userID,
        }
      );
      // setNotes([...notes, response.data]);
      if (response.status === 201 || response.data === 200) {
        alert(response.data.message);
      }
      setNewNote(""); // Clear the new note input
    } catch (error) {
      alert("Error Adding note");
    }
    setIsNoteModalOpen(false); // Add the new note to the state
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/api/note/delete/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId)); // Remove deleted note from state
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const processMap = {
    process1: "Inspection",
    process2: "washing",
    process3: "sorting",
    process4: "iron",
  };

  const processOptions = Object.keys(processMap).map((key) => ({
    value: key,
    label: processMap[key],
  }));

  
  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`api/processes/current-process`);
      setData(response.data);

      // Apply initial filtering
      const filtered = filterOrders(response.data);
      setFilteredOrders(filtered);
      setVisibleOrders(filtered.slice(0, pageSize));
      setHasMore(filtered.length > pageSize); // Set hasMore based on filtered data length
      setPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search query, selected processes, and TAT range
  // const filterOrders = (orders) => {
  //   return orders
  //     .filter((item) => {
  //       const searchLower = searchQuery.toLowerCase();
  //       return (
  //         item.order.orderId.toLowerCase().includes(searchLower) ||
  //         item.order.name.toLowerCase().includes(searchLower)
  //       );
  //     })
  //     .filter((item) => {
  //       return (
  //         selectedProcesses.length === 0 ||
  //         selectedProcesses.includes(item.currentProcess)
  //       );
  //     })
  //     .filter((item) => item.isCompleted === "false")
  //     .filter(filterByTAT);
  // };


  const filterOrders = (orders) => {
    if (!Array.isArray(orders)) {
      console.error("Expected orders to be an array, but got:", orders);
      return [];
    }
  
    return orders
      .filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.order.orderId.toLowerCase().includes(searchLower) ||
          item.order.name.toLowerCase().includes(searchLower)
        );
      })
      .filter((item) => {
        return (
          selectedProcesses.length === 0 ||
          selectedProcesses.includes(item.currentProcess)
        );
      })
      .filter((item) => item.isCompleted === "false")
      .filter(filterByTAT);
  };
  
  

  // Load more orders for infinite scroll
  const loadMoreOrders = () => {
    const nextPage = page + 1;
    const nextOrders = filteredOrders.slice(page * pageSize, nextPage * pageSize);

    if (nextOrders.length === 0) {
      setHasMore(false); // No more items to load
      return;
    }

    setVisibleOrders((prev) => [...prev, ...nextOrders]);
    setPage(nextPage);
  };

  // Update filteredOrders and visibleOrders when searchQuery, selectedProcesses, or selectedTATRange changes
  useEffect(() => {
    const filtered = filterOrders(data);
    setFilteredOrders(filtered);
    setVisibleOrders(filtered.slice(0, pageSize));
    setPage(1);
    setHasMore(filtered.length > pageSize); // Update hasMore based on filtered data length
  }, [searchQuery, selectedProcesses, selectedTATRange, data]);
  const detachPrevUser = async () => {
    try {
      await api.post(
        `api/userDirectories/detachOrder`,
        {
          orderId: selectedOrder.orderId,
          userID: selectedOrder.userID,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const assignNewUser = async () => {
    try {
      await api.post(
        `api/userDirectories/assignOrder`,
        {
          orderId: selectedOrder.orderId,
          userID: selectedUser,
          processName: selectedProcess,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchCrateOrders = async () => {
  //   try {
  //     const response = await api.get(
  //       `api/crates/all-orders`
  //     );
  //     setListOrders(response.data); // Store the list of crate orders in state
  //   } catch (error) {
  //     console.error("Error fetching crates:", error);
  //   }
  // };

  // const isCrateAssigned = (id) => {
  //   console.log(listOrders, id);
  //   return listOrders.includes(id);
  // };

  const fetchCrates = async () => {
    try {
      const response = await api.get(`api/crates`);
      setCrates(response.data.crates);
    } catch (error) {
      console.error("Error fetching crates:", error);
    }
  };

  const calculateTAT = (dateOfOrder) => {
    const currentDate = new Date();
    const orderedDate = new Date(dateOfOrder);

    const timeDifference = orderedDate - currentDate;

    if (timeDifference < 0) {
      return 0;
    }

    const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
    return hoursLeft;
  };

  const formatTAT = (hoursLeft) => {
    if (hoursLeft === 0) {
      return "0 hrs"; // Delivery date has passed
    }
    if (hoursLeft > 72) {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${daysLeft} days`;
    } else {
      return `${hoursLeft} hrs`;
    }
  };

  const getTATClass = (hoursLeft) => {
    // const hoursLeft = daysLeft * 24;
    if (hoursLeft <= 24) return "text-red-600 font-bold";
    if (hoursLeft <= 48) return "text-yellow-600 font-bold";
    if (hoursLeft <= 72) return "text-green-600 font-bold";
    return "text-gray-800";
  };



  const fetchUser = async () => {
    try {
      const response = await api.get(`api/users`);
      setUsers(response.data.filter(user => user.role !== 'driver'));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssign = (order, process) => {
    setSelectedUser("");
    fetchUser();
    setSelectedOrder(order);
    fetchNotes(order._id);
    setAssignModalOpen(true);
    setSelectedProcess(process);
  };

  const openCrateModal = (order) => {
    setSelectedOrder(order);
    setShowCrateModal(true);
    fetchCrates();
  };

  const processCompleted = async (orderId, delivery) => {
    try {
      const response = await api.patch(
        `api/processes/process-completion/${orderId}`
      );
      if (delivery) {
        await api.patch(`api/orders/orderId/${orderId}`, {
          status: "Ready to be Delivered",
        });
      }
      alert(response.data.message);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };


  const handleUserSelection = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleProcessChange = (selectedOptions) => {
    setSelectedProcesses(selectedOptions.map((option) => option.value));
  };




  const assignCrate = async () => {
    try {
      const response = await api.patch(
        `api/crates/assign-crate/${selectedOrder.order.orderId}`,
        {
          crateId: selectedCrate,
        }
      );
      // fetchCrateOrders();
      alert(response.data.message);
      setShowCrateModal(false);
      fetchData();
    } catch (error) {
      console.error("Error assigning crate:", error);
    }
  };

  //filter by tat
  const filterByTAT = (item) => {
    const daysLeft = calculateTAT(item.order.dateOfDelivery); // Assuming calculateTAT returns the TAT in hours

    if (selectedTATRange === "0hr") return daysLeft <= 24;
    if (selectedTATRange === "24hr") return daysLeft > 24 && daysLeft <= 48;
    if (selectedTATRange === "48hr") return daysLeft > 48;
    return true; // No filter applied
  };

  const handleSaveAssignment = async () => {
    const user = users.find((user) => user.userID === selectedUser);


    try {
      const response = await api.post(`api/iron-unit`, {
        userID: selectedUser,
        orderId: selectedOrder._id,
        units: unit
      });
      alert('Iron units updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      alert(`Error: ${errorMessage}`);
      console.error('Error updating iron units:', errorMessage);
    }

    let process = {};
    let currentProcess = "";

    try {

      // Fetch the current process and process details
      const response = await api.get(
        `api/processes/order-process/${selectedOrder.orderId}`
      );
      const data = response.data;
      currentProcess = data.currentProcess;
      process = data.process;

      // Mark the current process as completed if applicable
      if (currentProcess > "process0") {
        process[`${currentProcess}`].status = "Completed";
      }

      // Update the selected process with the user, unit, and status
      process[`${selectedProcess}`].userId = selectedUser;
      process[`${selectedProcess}`].unit = unit;
      process[`${selectedProcess}`].timing = new Date().toISOString();
      process[`${selectedProcess}`].status = "Running";

    } catch (error) {
      console.error("Error fetching process details:", error);
      return;
    }

    try {
      // Save the updated process details
      const response = await api.put(
        `api/processes/order-process/${selectedOrder.orderId}`,
        {
          currentProcess: selectedProcess,
          userId: selectedUser,
          unit,
          process, // Updated process details
        }
      );

      if (response.status === 200) {
        alert(
          `Order assigned successfully to user ${selectedUser} with unit ${unit}`
        );
        fetchData(); // Refresh data after assignment
      } else {
        throw new Error("Failed to assign order");
      }

      // Additional operations like detaching or notifying users
      if (currentProcess > "process0") {
        detachPrevUser();
      }
      assignNewUser();

      // Reset modal state
      setSelectedUser("");
      setSelectedProcess("");
      setUnit("");
      setAssignModalOpen(false);
    } catch (error) {
      console.error("Error assigning order:", error);
      alert(
        `Error assigning order to user ${selectedUser} with unit ${unit}. Please try again.`
      );
    }

    // Notify via external API
    // const user = users.find((user) => user.userID === selectedUser);
    // fetchNotes(selectedOrder._id);

    const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
    const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;
    const template = "process_update";
    const contact = user.phoneNumber;
    const name = user.name;
    const noteCombine =
      notes.length > 0 &&
      notes.map((item, index) => `${index + 1}. ${item.content}`).join(" ::: ");
    const note = noteCombine.length > 0 ? noteCombine.replaceAll(",", ";").trim() : "none";

    const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(
      apiKey
    )}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(
      name
    )},${encodeURIComponent(
      selectedOrder.orderId
    )},${encodeURIComponent(
      processMap[selectedProcess]
    )},${encodeURIComponent(note)}&Name=${encodeURIComponent(name)}`;


    api
      .get(url)
      .then((response) => {
        console.log("Notification sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Status</h2>
      <div className="py-5 flex flex-wrap gap-5">
        <Select
          isMulti
          options={processOptions}
          onChange={handleProcessChange}
          placeholder="Select Process"
        />
        <select
          className=" py-2 px-4 rounded bg-gray-100"
          onChange={(e) => setSelectedTATRange(e.target.value)}
          value={selectedTATRange}
        >
          <option value="">Select TAT</option>
          <option value="0hr">0hr (Up to 24 hours)</option>
          <option value="24hr">24hr (24 to 48 hours)</option>
          <option value="48hr">48hr (Over 48 hours)</option>
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="py-2 px-4 rounded border border-gray-300 w-full"
          placeholder="Search by Order ID or Name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="shadow-lg">
        <div id="scrollableDiv"  className="relative overflow-x-auto max-h-[40rem]">
        <InfiniteScroll
          dataLength={visibleOrders.length} // Current number of visible items
          next={loadMoreOrders} // Function to load more items
          hasMore={hasMore} // Whether there are more items to load
          loader={<p className="text-center p-2 text-sm">Loading more orders...</p>} // Loading indicator
          scrollableTarget="scrollableDiv" // ID of the scrollable container
        >
            <table className="min-w-full table-fixed bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200 sticky top-0">
                  <th className="py-2 px-4 border-b">Order ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Crate No.</th>
                  <th className="py-2 px-4 border-b">Process</th>
                  <th className="py-2 px-4 border-b">TAT </th>
                  <th className="py-2 px-4 border-b">Order Date</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Category </th>
                  <th className="py-2 px-4 border-b">Product </th>
                  <th className="py-2 px-4 border-b">Garment Details</th>
                  <th className="py-2 px-4 border-b">Total Units </th>
                  <th className="py-2 px-4 border-b">Date of Delivery </th>
                  <th className="py-2 px-4 border-b">Actions</th>
                  <th className="py-2 px-4 border-b">Notes</th>
                  <th className="py-2 px-4 border-b">Crate Assign</th>
                  <th className="py-2 px-4 border-b">End Process</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders
                  .filter((item) => {
                    const searchLower = searchQuery.toLowerCase();
                    return (
                      item.order.orderId.toLowerCase().includes(searchLower) ||
                      item.order.name.toLowerCase().includes(searchLower)
                    );
                  })
                  .filter((item) => {
                    return (
                      selectedProcesses.length === 0 ||
                      selectedProcesses.includes(item.currentProcess)
                    );
                  })
                  .filter((item) => item.isCompleted === "false")
                  .filter(filterByTAT)
                  .map((item) => {
                    const daysLeft = calculateTAT(item.order.dateOfDelivery);
                    const tatClass = getTATClass(daysLeft);
                    const tatDisplay = formatTAT(daysLeft);
                    return (
                      <tr key={item.order.orderId} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">
                          {item.order.orderId}
                        </td>
                        <td className="py-2 px-4 border-b">{item.order.name}</td>
                        <td className="py-2 px-4 border-b">
                          {item.order.userID || "Null"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.order.crateNumbers.join(", ") || "Null"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {processMap[item.currentProcess] || "Null"}
                        </td>
                        <td className={`py-2 px-4 border-b ${tatClass}`}>
                          {tatDisplay}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(item.order.dateOfOrder)
                            .toISOString()
                            .slice(0, 10)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {parseFloat(item.order.totalPrice).toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.order.category.join(", ")}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.order.products
                            .map((prod, index) => {
                              let unit = item.order.units[index];
                              let cat = item.order.category[index];
                              if (cat.includes("Kilowise")) {
                                unit = `${unit}KG`;
                              }
                              return `${prod}: ${unit}`;
                            })
                            .join(", ")}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {(item.order?.garmentDetails?.length > 0 &&
                            item.order?.garmentDetails
                              .map((garmentDetails, index) => {
                                return Array.isArray(garmentDetails) &&
                                  garmentDetails.length > 0
                                  ? garmentDetails
                                    .map((garment, i) => {
                                      const subunit =
                                        item.order?.subUnits[index]?.[i]; // Access the corresponding subunit
                                      return subunit
                                        ? `${garment}: ${subunit}`
                                        : null; // Only include non-null subunits
                                    })
                                    .filter((pair) => pair !== null) // Remove any null values
                                    .join(", ")
                                  : null;
                              })
                              .filter((pair) => pair !== null) // Remove any null or empty strings
                              .join(", ")) ||
                            "NA"}
                        </td>

                        <td className="py-2 px-4 border-b">
                          {item.order.units.reduce((sum, unit, i) => {
                            const subUnitTotal = Array.isArray(item.order.subUnits[i]) && item.order.subUnits[i]
                              ? item.order.subUnits[i].reduce((acc, val) => acc + val, 0)
                              : 0;
                            return sum + (subUnitTotal > 0 ? subUnitTotal : unit);
                          }, 0)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(item.order.dateOfDelivery)
                            .toISOString()
                            .slice(0, 10)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <select
                            className="py-2 px-4 rounded bg-gray-100"
                            onChange={(e) =>
                              handleAssign(item.order, e.target.value)
                            }
                            value={selectedProcess}
                            disabled={item.isCompleted === "true"}
                          >
                            <option value="">Select Process</option>
                            {["process1", "process2", "process3", "process4"].map(
                              (process) => (
                                <option
                                  key={process}
                                  value={process}
                                  disabled={process <= item.currentProcess}
                                >
                                  {processMap[process]}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => openNoteModal(item.order)} // Pass the entire order object
                          >
                            View Notes
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          <button
                            onClick={() => openCrateModal(item)}
                            className={`px-4 py-2 rounded text-white ${
                              // isCrateAssigned(item.order._id)
                              // ? "bg-gray-400 cursor-not-allowed"
                              "bg-green-500 hover:bg-green-600"
                              }`}
                          // disabled={isCrateAssigned(item.order._id)}
                          >
                            {"Add Crate"}
                            {/* {isCrateAssigned(item.order._id) ? "Added" : "Add Crate"} */}
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className={`px-4 py-2 rounded text-white ${item.isCompleted === "true"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            onClick={() =>
                              processCompleted(
                                item.order.orderId,
                                item.order.delivery
                              )
                            }
                            disabled={item.isCompleted === "true"}
                          >
                            {item.isCompleted === "true" ? "Finished" : "Finish"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
      {/* Modal for assigning users */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Assign Process to User</h3>
            <div>
              <p className="mb-2">Order ID: {selectedOrder.orderId}</p>
            </div>
            <div className="mt-4">
              {users.map((user) => (
                <div key={user._id} className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="user"
                      value={user.userID}
                      onChange={handleUserSelection}
                      checked={selectedUser === user.userID}
                      className="mr-2"
                    />
                    <label>{`${user.name} - ${user.userID}`}</label>
                  </div>

                  {/* Show input field only if selected process is 'iron' */}
                  {selectedUser === user.userID && selectedProcess === "process4" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Unit:
                      </label>
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="Enter unit"
                        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={handleSaveAssignment}
                disabled={!selectedUser || (selectedProcess === "process4" && !unit)} // Disable Save button until a user is selected and unit is entered for "iron" process
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedProcess("");
                  setSelectedUser("");
                  setUnit(""); // Clear the unit when modal is closed
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}




      {showCrateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Assign Crate for Order {selectedOrder.order?.orderId}
            </h3>

            {/* Search Input for Crates */}
            <input
              type="text"
              placeholder="Search Crates..."
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={crateSearch}
              onChange={(e) => setCrateSearch(e.target.value)}
            />

            <select
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={selectedCrate}
              onChange={(e) => setSelectedCrate(e.target.value)}
            >
              <option value="">Select Crate</option>
              {crates
                .filter(
                  (crate) =>
                    crate.crateNumber
                      .toLowerCase()
                      .includes(crateSearch.toLowerCase()) ||
                    crate.status
                      .toLowerCase()
                      .includes(crateSearch.toLowerCase()) // Search by crate number or status
                )
                .map((crate) => (
                  <option key={crate._id} value={crate._id}>
                    {crate.crateNumber} - {crate.status}
                  </option>
                ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCrateModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={assignCrate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={!selectedCrate}
              >
                Assign Crate
              </button>
            </div>
          </div>
        </div>
      )}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Notes for This Order
            </h3>

            {/* Display existing notes */}
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

            {/* Add new note */}
            <div className="mb-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Add a new note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setIsNoteModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => addNote(selectedOrder)} // Wrap the function call inside an arrow function
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentStatus;


