import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import config from '../config';
import InfiniteScroll from 'react-infinite-scroll-component';

const DriverTrackingPage = () => {
  const [drivers, setDrivers] = useState([]); // All drivers data from the backend
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDriverId, setExpandedDriverId] = useState(null);
  const [visibleDrivers, setVisibleDrivers] = useState([]); // Drivers currently visible
  const [hasMore, setHasMore] = useState(true); // Whether there are more drivers to load
  const [page, setPage] = useState(0); // Current page for pagination
  const pageSize = 10; // Number of drivers to load per page

  useEffect(() => {
    fetchDrivers();
  }, [searchTerm]);

  const fetchDrivers = () => {
    api
      .get(`api/drivers/status`, {
        params: { search: searchTerm }
      })
      .then(response => {
        setDrivers(response.data);
        setVisibleDrivers(response.data.slice(0, pageSize)); // Load initial set of drivers
        setHasMore(response.data.length > pageSize); // Set hasMore based on total drivers
        setPage(0);
      })
      .catch(error => console.error('Error fetching drivers:', error));
  };

  // No more frontend filtering; backend will filter based on search term

  const loadMoreDrivers = () => {
    const nextPage = page + 1;
    const nextDrivers = drivers.slice(
      nextPage * pageSize,
      (nextPage + 1) * pageSize
    );

    if (nextDrivers.length === 0) {
      setHasMore(false);
      return;
    }

    setVisibleDrivers(prev => [...prev, ...nextDrivers]);
    setPage(nextPage);
  };

  const toggleExpand = (driverId) => {
    setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
  };

  return (
    <div className="w-full p-6 bg-gray-100 mt-8">
      <h1 className="text-2xl font-semibold mb-4">Driver Tracking</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Driver ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div id="scrollableDiv" className="overflow-y-auto max-h-[70vh]">
        <InfiniteScroll
          dataLength={visibleDrivers.length}
          next={loadMoreDrivers}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4 text-gray-500">
              Loading more drivers...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border px-4 py-2 text-left text-gray-600">Driver ID</th>
                <th className="border px-4 py-2 text-left text-gray-600">Driver Name</th>
                <th className="border px-4 py-2 text-left text-gray-600">Orders Delivered</th>
                <th className="border px-4 py-2 text-left text-gray-600">Products</th>
                <th className="border px-4 py-2 text-left text-gray-600">Last Known Location</th>
                <th className="border px-4 py-2 text-left text-gray-600">More Details</th>
              </tr>
            </thead>
            <tbody>
              {visibleDrivers.length > 0 ? (
                visibleDrivers.map((driver) => (
                  <React.Fragment key={driver.driverId}>
                    <tr>
                      <td className="border px-4 py-2">{driver.driverId}</td>
                      <td className="border px-4 py-2">{driver.driverName}</td>
                      <td className="border px-4 py-2">{driver.id.dateOfDelivery}</td>
                      <td className="border px-4 py-2">{driver.id.products.join(', ')}</td>
                      <td className="border px-4 py-2">{driver.location}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => toggleExpand(driver.driverId)}
                          className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
                        >
                          Check
                        </button>
                      </td>
                    </tr>
                    {expandedDriverId === driver.driverId && (
                      <tr>
                        <td colSpan="6" className="border px-4 py-2">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold">Order Details:</h3>
                            <p>{`Customer Name: ${driver.name}`}</p>
                            <p>{`Order ID: ${driver.orderId}`}</p>
                            <p>{`Total Price: ${driver.id.totalPrice.toFixed(2)}`}</p>
                            <p>{`Payment Status: ${driver.id.paymentStatus}`}</p>
                            <p>{`Order Status: ${driver.id.status}`}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border px-4 py-2 text-center text-gray-500">
                    No drivers found
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

export default DriverTrackingPage;
