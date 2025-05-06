import React, { useState, useEffect } from "react";
import config from "../config";

const PickupDirectory = () => {
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Fetch all pickups from the backend
    fetch(`${config.baseURL}/api/pickups`)
      .then((response) => response.json())
      .then((data) => setPickups(data))
      .catch((err) => console.error("Failed to fetch pickups:", err));
  }, []);

  const handleFilter = () => {
    if (!selectedDate) return;

    const selectedDateObj = new Date(selectedDate);

    // Filter pickups by comparing the `date` field 
    const filtered = pickups.filter((pickup) => {
      const pickupDate = new Date(pickup.date);
      return (
        pickupDate.getFullYear() === selectedDateObj.getFullYear() &&
        pickupDate.getMonth() === selectedDateObj.getMonth() &&
        pickupDate.getDate() === selectedDateObj.getDate()
      );
    });

    setFilteredPickups(filtered);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Pickup Directory
      </h1>

      {/* Date Filter */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md transition"
        >
          Filter by Date
        </button>
      </div>

      {/* Pickup Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Customer Name</th>
              <th className="py-2 px-4 text-left">Phone Number</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Route</th>
              <th className="py-2 px-4 text-left">Driver Name</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(filteredPickups.length > 0 ? filteredPickups : pickups).map(
              (pickup) => (
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
                  <td className="py-2 px-4">
                    {new Date(pickup.date).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupDirectory;


// import React, { useState, useEffect } from "react";
// import InfiniteScroll from 'react-infinite-scroll-component';
// import config from "../config";

// const PickupDirectory = () => {
//   const [allPickups, setAllPickups] = useState([]);
//   const [visiblePickups, setVisiblePickups] = useState([]);
//   const [filteredPickups, setFilteredPickups] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 2;

//   useEffect(() => {
//     // Fetch all pickups from the backend
//     fetch(`${config.baseURL}/api/pickups`)
//       .then((response) => response.json())
//       .then((data) => {
//         setAllPickups(data);
//         setVisiblePickups(data.slice(0, itemsPerPage));
//       })
//       .catch((err) => console.error("Failed to fetch pickups:", err));
//   }, []);

//   // Load more data when page changes
//   useEffect(() => {
//     const dataToShow = filteredPickups.length > 0 ? filteredPickups : allPickups;
//     const nextItems = dataToShow.slice(0, page * itemsPerPage);
//     setVisiblePickups(nextItems);
//     setHasMore(nextItems.length < dataToShow.length);
//   }, [page, allPickups, filteredPickups]);

//   const handleFilter = () => {
//     if (!selectedDate) {
//       setFilteredPickups([]);
//       setPage(1);
//       return;
//     }

//     const selectedDateObj = new Date(selectedDate);

//     // Filter pickups by comparing the `date` field 
//     const filtered = allPickups.filter((pickup) => {
//       const pickupDate = new Date(pickup.date);
//       return (
//         pickupDate.getFullYear() === selectedDateObj.getFullYear() &&
//         pickupDate.getMonth() === selectedDateObj.getMonth() &&
//         pickupDate.getDate() === selectedDateObj.getDate()
//       );
//     });

//     setFilteredPickups(filtered);
//     setPage(1);
//   };

//   const fetchMoreData = () => {
//     if (visiblePickups.length >= (filteredPickups.length > 0 ? filteredPickups.length : allPickups.length)) {
//       setHasMore(false);
//       return;
//     }
//     setPage(prevPage => prevPage + 1);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6 mt-10">
//       <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
//         Pickup Directory
//       </h1>

//       {/* Date Filter */}
//       <div className="flex justify-center items-center gap-4 mb-6">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={handleFilter}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md transition"
//         >
//           Filter by Date
//         </button>
//       </div>

//       {/* Pickup Table */}
//       <div id="scrollableDiv" style={{ maxHeight: '70vh', overflow: 'auto' }}>
//         <InfiniteScroll
//           dataLength={visiblePickups.length}
//           next={fetchMoreData}
//           hasMore={hasMore}
//           loader={<div className="text-center p-4">Loading more pickups...</div>}
//           scrollableTarget="scrollableDiv"
//         >
//           <table className="w-full table-auto bg-white shadow-md rounded-lg">
//             <thead className="bg-gray-500 text-white sticky top-0">
//               <tr>
//                 <th className="py-2 px-4 text-left">Customer Name</th>
//                 <th className="py-2 px-4 text-left">Phone Number</th>
//                 <th className="py-2 px-4 text-left">Address</th>
//                 <th className="py-2 px-4 text-left">Location</th>
//                 <th className="py-2 px-4 text-left">Route</th>
//                 <th className="py-2 px-4 text-left">Driver Name</th>
//                 <th className="py-2 px-4 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visiblePickups.map((pickup) => (
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
//                   <td className="py-2 px-4">
//                     {new Date(pickup.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </InfiniteScroll>
//       </div>
//     </div>
//   );
// };

// export default PickupDirectory;