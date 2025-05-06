// import { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../config";
// import InfiniteScroll from "react-infinite-scroll-component";

// const processMapping = {
//   1: "Inspection",
//   2: "Packing",
//   3: "Sorting",
//   4: "Ironing",
// };

// const ProductCount = () => {
//   const [orders, setOrders] = useState([]); // All orders from the backend
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [visibleOrders, setVisibleOrders] = useState([]); // Orders currently visible
//   const [hasMore, setHasMore] = useState(true); // Whether there are more orders to load
//   const [page, setPage] = useState(0); // Current page for pagination
//   const pageSize = 10; // Number of orders to load per page

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${config.baseURL}/api/orders`);
//         setOrders(response.data);
//         setVisibleOrders(response.data.slice(0, pageSize)); // Load initial set of orders
//         setHasMore(response.data.length > pageSize); // Set hasMore based on total orders
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const handleSeeMore = async (orderId) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${config.baseURL}/api/qr-process/${orderId}`);
//       if (!response.data) {
//         setSelectedOrder({ orderId, noProcesses: true });
//       } else {
//         setSelectedOrder(response.data.order);
//       }
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       setSelectedOrder({ orderId, noProcesses: true });
//     }
//     setLoading(false);
//   };

//   // Filter orders based on search term
//   const filterOrders = (orders, searchTerm) => {
//     return orders.filter(
//       (order) =>
//         order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   // Load more orders for infinite scroll
//   const loadMoreOrders = () => {
//     const nextPage = page + 1;
//     const nextOrders = filterOrders(orders, searchTerm).slice(
//       nextPage * pageSize,
//       (nextPage + 1) * pageSize
//     );

//     if (nextOrders.length === 0) {
//       setHasMore(false); // No more orders to load
//       return;
//     }

//     setVisibleOrders((prev) => [...prev, ...nextOrders]);
//     setPage(nextPage);
//   };

//   // Handle search input changes
//   const handleSearch = (e) => {
//     const searchTerm = e.target.value;
//     setSearchTerm(searchTerm);

//     const filtered = filterOrders(orders, searchTerm);
//     setVisibleOrders(filtered.slice(0, pageSize)); // Reset visibleOrders to the first page of filtered results
//     setPage(0); // Reset page to 0
//     setHasMore(filtered.length > pageSize); // Update hasMore based on the filtered data length
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 mt-16">
//       <input
//         type="text"
//         placeholder="Search by Order ID or Customer Name"
//         className="mb-4 w-full p-2 border border-gray-300 rounded"
//         value={searchTerm}
//         onChange={handleSearch}
//       />

//       <div id="scrollableDiv" className="overflow-x-auto overflow-y-auto max-h-96 shadow-lg rounded-lg">
//         <InfiniteScroll
//           dataLength={visibleOrders.length}
//           next={loadMoreOrders}
//           hasMore={hasMore}
//           loader={
//             <div className="text-center p-4 text-gray-500">
//               Loading more orders...
//             </div>
//           }
//           scrollableTarget="scrollableDiv"
//         >
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="sticky top-0 bg-blue-500 text-white uppercase text-sm">
//               <tr>
//                 <th className="py-3 px-6 text-left">Order ID</th>
//                 <th className="py-3 px-6 text-left">Customer Name</th>
//                 <th className="py-3 px-6 text-left">Mobile Number</th>
//                 <th className="py-3 px-6 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleOrders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border-b border-gray-200 hover:bg-gray-100"
//                 >
//                   <td className="py-3 px-6">{order.orderId}</td>
//                   <td className="py-3 px-6">{order.name}</td>
//                   <td className="py-3 px-6">{order.phoneNumber}</td>
//                   <td className="py-3 px-6 text-center">
//                     <button
//                       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                       onClick={() => handleSeeMore(order.orderId)}
//                       disabled={loading}
//                     >
//                       {loading ? "Loading..." : "See More"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </InfiniteScroll>
//       </div>

//       {selectedOrder && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4">
//               Order Details - {selectedOrder.orderId}
//             </h2>
//             {selectedOrder.noProcesses ? (
//               <p className="text-lg font-medium text-center text-gray-600">
//                 No QR process done yet.
//               </p>
//             ) : (
//               <>
//                 <p className="text-lg font-medium mb-2">
//                   Total Units: {selectedOrder.units}
//                 </p>
//                 <table className="min-w-full bg-white border border-gray-300">
//                   <thead className="bg-gray-200 text-black">
//                     <tr>
//                       <th className="py-3 px-6 text-left">Unit</th>
//                       <th className="py-3 px-6 text-left">Inspection</th>
//                       <th className="py-3 px-6 text-left">Packing</th>
//                       <th className="py-3 px-6 text-left">Sorting</th>
//                       <th className="py-3 px-6 text-left">Ironing</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedOrder.processesPerUnit.map((unit) => {
//                       // Map processes to their respective columns
//                       let processStatus = { 1: "Not Done", 2: "Not Done", 3: "Not Done", 4: "Not Done" };
//                       unit.processes.forEach((process) => {
//                         if (processMapping[process.processNumber]) {
//                           processStatus[process.processNumber] = `Done by ${process.userID.name}`;
//                         }
//                       });

//                       return (
//                         <tr key={unit.unitNumber} className="border-b border-gray-200">
//                           <td className="py-3 px-6">{unit.unitNumber}</td>
//                           <td className="py-3 px-6">{processStatus[1]}</td>
//                           <td className="py-3 px-6">{processStatus[2]}</td>
//                           <td className="py-3 px-6">{processStatus[3]}</td>
//                           <td className="py-3 px-6">{processStatus[4]}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </>
//             )}
//             <button
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               onClick={() => setSelectedOrder(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCount;
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // State for the three functionalities
  const [showCrateModal, setShowCrateModal] = useState(false);
  const [showDetailsModel, setShowDetailsModel] = useState(false);
  const [selectedCrate, setSelectedCrate] = useState("");
  const [crates, setCrates] = useState([]);
  const [crateSearch, setCrateSearch] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/api/orders`);
        setOrders(response.data);
        setVisibleOrders(response.data.slice(0, pageSize));
        setHasMore(response.data.length > pageSize);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleSeeMore = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/api/qr-process/${orderId}`
      );
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
    setShowDetailsModel(true);
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

  // Functions for the three functionalities
  const fetchCrates = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/crates`);
      setCrates(response.data.crates);
    } catch (error) {
      console.error("Error fetching crates:", error);
    }
  };

  const fetchNotes = async (orderId) => {
    try {
      const response = await axios.get(`${config.baseURL}/api/note/${orderId}`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const openCrateModal = (order) => {
    setSelectedOrder(order);
    fetchCrates();
    setShowCrateModal(true);
  };

  const openNoteModal = (order) => {
    setSelectedOrder(order);
    fetchNotes(order.orderId);
    setIsNoteModalOpen(true);
  };

  const assignCrate = async () => {
    if (!selectedCrate) {
      alert("Please select a crate");
      return;
    }

    try {
      await axios.patch(
        `${config.baseURL}/api/crates/assign-crate/${selectedOrder.orderId}`,
        {
          crateId: selectedCrate,
        }
      );

      alert("Crate assigned successfully");
      setShowCrateModal(false);
      setSelectedCrate("");
    } catch (error) {
      console.error("Error assigning crate:", error);
      alert("Failed to assign crate");
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      alert("Please enter a note");
      return;
    }

    try {
      await axios.post(
        `${config.baseURL}/api/note/add/${selectedOrder.orderId}`,
        {
          content: newNote,
          userID: selectedOrder.userID || "admin", // Change this to the actual user ID
        }
      );

      setNewNote("");
      fetchNotes(selectedOrder.orderId);
      alert("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note");
    }
  };

  const processCompleted = async (orderId) => {
    try {
      await axios.patch(
        `${config.baseURL}/api/processes/process-completion/${orderId}`
      );
      alert("Process marked as completed");
    } catch (error) {
      console.error("Error completing process:", error);
      alert("Failed to complete process");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 mt-16">
      <input
        type="text"
        placeholder="Search by Order ID or Customer Name"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div
        id="scrollableDiv"
        className="overflow-x-auto overflow-y-auto max-h-96 shadow-lg rounded-lg"
      >
        <InfiniteScroll
          dataLength={visibleOrders.length}
          next={loadMoreOrders}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4 text-gray-500">
              Loading more orders...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="sticky top-0 bg-blue-500 text-white uppercase text-sm">
              <tr>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Mobile Number</th>
                <th className="py-3 px-6 text-center">Details</th>
                <th className="py-3 px-6 text-center">Notes</th>
                <th className="py-3 px-6 text-center">Crate</th>
                <th className="py-3 px-6 text-center">Complete</th>
              </tr>
            </thead>
            <tbody>
              {/* {visibleOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{order.orderId}</td>
                  <td className="py-3 px-6">{order.name}</td>
                  <td className="py-3 px-6">{order.phoneNumber}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                      onClick={() => handleSeeMore(order.orderId)}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Details"}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => openNoteModal(order)}
                    >
                      Notes
                    </button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => openCrateModal(order)}
                    >
                      Crate
                    </button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => processCompleted(order.orderId)}
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))} */}
              {Array.isArray(visibleOrders) && visibleOrders.length > 0 ? (
                visibleOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{order.orderId}</td>
                    <td className="py-3 px-6">{order.name}</td>
                    <td className="py-3 px-6">{order.phoneNumber}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={() => handleSeeMore(order.orderId)}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Details"}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openNoteModal(order)}
                      >
                        Notes
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => openCrateModal(order)}
                      >
                        Crate
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => processCompleted(order.orderId)}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {showDetailsModel && (
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
                    {selectedOrder.processesPerUnit?.map((unit) => {
                      let processStatus = {
                        1: "Not Done",
                        2: "Not Done",
                        3: "Not Done",
                        4: "Not Done",
                      };
                      unit.processes?.forEach((process) => {
                        if (processMapping[process.processNumber]) {
                          processStatus[process.processNumber] = `Done by ${
                            process.userID?.name || "Unknown"
                          }`;
                        }
                      });

                      return (
                        <tr
                          key={unit.unitNumber}
                          className="border-b border-gray-200"
                        >
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
              onClick={() => setShowDetailsModel(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Crate Modal */}
      {showCrateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Assign Crate for Order {selectedOrder.orderId}
            </h3>
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
                      .includes(crateSearch.toLowerCase())
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

      {/* Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Notes for Order {selectedOrder.orderId}
            </h3>
            <div className="mb-4 max-h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="mb-3 p-2 bg-white rounded shadow"
                  >
                    <p className="text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-800">{note.content}</p>
                    <p className="text-xs text-gray-500">
                      By: {note.createdBy?.name || "Unknown"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No notes available</p>
              )}
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Add a new note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setIsNoteModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addNote}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCount;
