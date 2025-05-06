// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../config";

// const InventoryManagement = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCrateModal, setShowCrateModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [crates, setCrates] = useState([]);
//   const [crateSearch, setCrateSearch] = useState("");
//   const [selectedCrate, setSelectedCrate] = useState("");
//   // const [listOrders, setListOrders] = useState([]); // State to store crate orders

//   useEffect(() => {
//     fetchOrders();
//     // fetchCrateOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${config.baseURL}/api/processes/current-process`
//       );
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchCrateOrders = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       `${config.baseURL}/api/crates/all-orders`
//   //     );
//   //     setListOrders(response.data); // Store the list of crate orders in state
//   //   } catch (error) {
//   //     console.error("Error fetching crates:", error);
//   //   }
//   // };

//   // const isCrateAssigned = (id) => {
//   //   console.log(listOrders, id);
//   //   return listOrders.includes(id);
//   // };

//   const fetchCrates = async () => {
//     try {
//       const response = await axios.get(`${config.baseURL}/api/crates`);
//       setCrates(response.data.crates);
//     } catch (error) {
//       console.error("Error fetching crates:", error);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//   };

//   const openCrateModal = (order) => {
//     setSelectedOrder(order);
//     setShowCrateModal(true);
//     fetchCrates();
//   };

//   const assignCrate = async () => {
//     try {
//       const response = await axios.patch(
//         `${config.baseURL}/api/crates/assign-crate/${selectedOrder.order.orderId}`,
//         {
//           crateId: selectedCrate,
//         }
//       );
//       // fetchCrateOrders();
//       alert(response.data.message);
//       setShowCrateModal(false);
//       fetchOrders();
//     } catch (error) {
//       console.error("Error assigning crate:", error);
//     }
//   };

//   const filteredOrders = data.filter((item) => {
//     const searchLower = search.toLowerCase();
//     return (
//       item.order.orderId.toLowerCase().includes(searchLower) ||
//       item.order.name.toLowerCase().includes(searchLower)
//     );
//   });

//   if (loading) return <div>Loading orders...</div>;

//   return (
//     <div className="container mx-auto p-4 mt-8">
//       <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by Name or Order ID"
//           value={search}
//           onChange={handleSearch}
//           className="px-4 py-2 border border-gray-300 rounded"
//         />
//         <button
//           onClick={() => {
//             fetchOrders();
//             // fetchCrateOrders();
//           }}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Refresh
//         </button>
//       </div>
//       <div className="overflow-y-auto max-h-[40rem]">
//         <table className="min-w-full table-fixed bg-white border-collapse">
//           <thead className="bg-gray-300 text-gray-700 sticky top-0">
//             <tr className="bg-gray-100">
//               <th className="py-2 px-4 border border-gray-300">Order ID</th>
//               <th className="py-2 px-4 border border-gray-300">
//                 Customer Name
//               </th>
//               <th className="py-2 px-4 border border-gray-300">User ID</th>
//               <th className="py-2 px-4 border border-gray-300">Crate No.</th>
//               {/* <th className="py-2 px-4 border border-gray-300">Units</th> */}
//               <th className="py-2 px-4 border border-gray-300">Product Name</th>
//               <th className="py-2 px-4 border border-gray-300">
//                 Garment Details
//               </th>
//               {/* <th className="py-2 px-4 border border-gray-300">SubUnits</th> */}
//               <th className="py-2 px-4 border border-gray-300">
//                 Date of Delivery
//               </th>
//               <th className="py-2 px-4 border border-gray-300">Address</th>
//               <th className="py-2 px-4 border border-gray-300">Category</th>
//               <th className="py-2 px-4 border border-gray-300">Status</th>
//               <th className="py-2 px-4 border border-gray-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders
//               .filter(
//                 (item) =>
//                   item.isCompleted === "true" &&
//                   item.order.status !== "Delivered"
//               )
//               .map((item) => (
//                 <tr key={item.order.orderId} className="hover:bg-gray-100">
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.orderId}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.name}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.userID || "Null"}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.crateNumbers.join(", ") || "Null"}
//                   </td>
//                   {/* <td className="py-2 px-4 border border-gray-300">
//                   {item.order.units.reduce((acc, curr) => acc + curr, 0)}
//                 </td> */}
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.products
//                       .map((prod, index) => {
//                         let unit = item.order.units[index];
//                         let cat = item.order.category[index];
//                         if (cat.includes("Kilowise")) {
//                           unit = `${unit}KG`;
//                         }
//                         return `${prod}: ${unit}`;
//                       })
//                       .join(", ")}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {(item.order?.garmentDetails?.length > 0 &&
//                       item.order?.garmentDetails
//                         .map((garmentDetails, index) => {
//                           return Array.isArray(garmentDetails) &&
//                             garmentDetails.length > 0
//                             ? garmentDetails
//                                 .map((garment, i) => {
//                                   const subunit =
//                                     item.order?.subUnits[index]?.[i]; // Access the corresponding subunit
//                                   return subunit
//                                     ? `${garment}: ${subunit}`
//                                     : null; // Only include non-null subunits
//                                 })
//                                 .filter((pair) => pair !== null) // Remove any null values
//                                 .join(", ")
//                             : null;
//                         })
//                         .filter((pair) => pair !== null) // Remove any null or empty strings
//                         .join(", ")) ||
//                       "NA"}
//                   </td>
//                   {/* <td className="py-2 px-4 border border-gray-300">
//                   {item.order.subUnits
//                     .flat()
//                     .reduce((sum, num) => sum + num, 0)}
//                 </td> */}
//                   <td className="py-2 px-4 border border-gray-300">
//                     {new Date(item.order.dateOfDelivery)
//                       .toISOString()
//                       .slice(0, 10)}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.address}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.category.join(", ")}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300">
//                     {item.order.status}
//                   </td>
//                   <td className="py-2 px-4 border border-gray-300 flex space-x-2">
//                     <button
//                       onClick={() => openCrateModal(item)}
//                       className={`px-4 py-2 rounded text-white ${
//                         // isCrateAssigned(item.order._id)
//                         // ? "bg-gray-400 cursor-not-allowed":
//                         "bg-green-500 hover:bg-green-600"
//                       }`}
//                       // disabled={isCrateAssigned(item.order._id)}
//                     >
//                       {"Add Crate"}
//                       {/* {isCrateAssigned(item.order._id) ? "Added" : "Add Crate"} */}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Modal for Assigning Crate */}
//       {showCrateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3">
//             <h3 className="text-xl font-semibold mb-4">
//               Assign Crate for Order {selectedOrder.order?.orderId}
//             </h3>

//             {/* Search Input for Crates */}
//             <input
//               type="text"
//               placeholder="Search Crates..."
//               className="w-full mb-4 p-2 border border-gray-300 rounded"
//               value={crateSearch}
//               onChange={(e) => setCrateSearch(e.target.value)}
//             />

//             <select
//               className="w-full mb-4 p-2 border border-gray-300 rounded"
//               value={selectedCrate}
//               onChange={(e) => setSelectedCrate(e.target.value)}
//             >
//               <option value="">Select Crate</option>
//               {crates
//                 .filter(
//                   (crate) =>
//                     crate.crateNumber
//                       .toLowerCase()
//                       .includes(crateSearch.toLowerCase()) ||
//                     crate.status
//                       .toLowerCase()
//                       .includes(crateSearch.toLowerCase()) // Search by crate number or status
//                 )
//                 .map((crate) => (
//                   <option key={crate._id} value={crate._id}>
//                     {crate.crateNumber} - {crate.status}
//                   </option>
//                 ))}
//             </select>

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowCrateModal(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={assignCrate}
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//                 disabled={!selectedCrate}
//               >
//                 Assign Crate
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryManagement;


import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const InventoryManagement = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCrateModal, setShowCrateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [crates, setCrates] = useState([]);
  const [crateSearch, setCrateSearch] = useState("");
  const [selectedCrate, setSelectedCrate] = useState("");
  // const [listOrders, setListOrders] = useState([]); // State to store crate orders

  useEffect(() => {
    fetchOrders();
    // fetchCrateOrders();
  }, [search]); // Added search as dependency

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/api/processes/current-process?search=${search}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchCrateOrders = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${config.baseURL}/api/crates/all-orders`
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
      const response = await axios.get(`${config.baseURL}/api/crates`);
      setCrates(response.data.crates);
    } catch (error) {
      console.error("Error fetching crates:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const openCrateModal = (order) => {
    setSelectedOrder(order);
    setShowCrateModal(true);
    fetchCrates();
  };

  const assignCrate = async () => {
    try {
      const response = await axios.patch(
        `${config.baseURL}/api/crates/assign-crate/${selectedOrder.order.orderId}`,
        {
          crateId: selectedCrate,
        }
      );
      // fetchCrateOrders();
      alert(response.data.message);
      setShowCrateModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Error assigning crate:", error);
    }
  };

  // Removed client-side filtering since it's now handled by the backend
  const filteredOrders = data.filter((item) => 
    item.isCompleted === "true" && item.order.status !== "Delivered"
  );

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name or Order ID"
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            fetchOrders();
            // fetchCrateOrders();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-y-auto max-h-[40rem]">
        <table className="min-w-full table-fixed bg-white border-collapse">
          <thead className="bg-gray-300 text-gray-700 sticky top-0">
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border border-gray-300">Order ID</th>
              <th className="py-2 px-4 border border-gray-300">
                Customer Name
              </th>
              <th className="py-2 px-4 border border-gray-300">User ID</th>
              <th className="py-2 px-4 border border-gray-300">Crate No.</th>
              {/* <th className="py-2 px-4 border border-gray-300">Units</th> */}
              <th className="py-2 px-4 border border-gray-300">Product Name</th>
              <th className="py-2 px-4 border border-gray-300">
                Garment Details
              </th>
              {/* <th className="py-2 px-4 border border-gray-300">SubUnits</th> */}
              <th className="py-2 px-4 border border-gray-300">
                Date of Delivery
              </th>
              <th className="py-2 px-4 border border-gray-300">Address</th>
              <th className="py-2 px-4 border border-gray-300">Category</th>
              <th className="py-2 px-4 border border-gray-300">Status</th>
              <th className="py-2 px-4 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item) => (
              <tr key={item.order.orderId} className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.orderId}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.userID || "Null"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.crateNumbers.join(", ") || "Null"}
                </td>
                {/* <td className="py-2 px-4 border border-gray-300">
                {item.order.units.reduce((acc, curr) => acc + curr, 0)}
              </td> */}
                <td className="py-2 px-4 border border-gray-300">
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
                <td className="py-2 px-4 border border-gray-300">
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
                {/* <td className="py-2 px-4 border border-gray-300">
                {item.order.subUnits
                  .flat()
                  .reduce((sum, num) => sum + num, 0)}
              </td> */}
                <td className="py-2 px-4 border border-gray-300">
                  {new Date(item.order.dateOfDelivery)
                    .toISOString()
                    .slice(0, 10)}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.address}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.category.join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {item.order.status}
                </td>
                <td className="py-2 px-4 border border-gray-300 flex space-x-2">
                  <button
                    onClick={() => openCrateModal(item)}
                    className={`px-4 py-2 rounded text-white ${
                      // isCrateAssigned(item.order._id)
                      // ? "bg-gray-400 cursor-not-allowed":
                      "bg-green-500 hover:bg-green-600"
                    }`}
                    // disabled={isCrateAssigned(item.order._id)}
                  >
                    {"Add Crate"}
                    {/* {isCrateAssigned(item.order._id) ? "Added" : "Add Crate"} */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for Assigning Crate */}
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
    </div>
  );
};

export default InventoryManagement;