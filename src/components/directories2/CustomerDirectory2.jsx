import api from '../../api/axios';
import React, { useEffect, useState } from 'react';
import config from '../config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import InfiniteScroll from 'react-infinite-scroll-component';

const CustomerDirectory = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCustomers, setVisibleCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const pageSize = 20;

  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    // Update visible customers when filters change
    const filtered = customers.filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm);

      const matchesDateRange =
        (!fromDate || new Date(customer.dateOfOrder) >= new Date(fromDate)) &&
        (!toDate || new Date(customer.dateOfOrder) <= new Date(toDate));

      return matchesSearch && matchesDateRange;
    });

    setFilteredCustomers(filtered);
    setVisibleCustomers(filtered.slice(0, pageSize));
    setPage(0);
    setHasMore(filtered.length > pageSize);
  }, [customers, searchTerm, fromDate, toDate]);

  const fetchCustomerData = async () => {
    try {
      const response = await api.get(`api/customers`);
      setCustomers(response.data.customers || []);
      setDetails(response.data.orders || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMoreCustomers = () => {
    const nextPage = page + 1;
    const nextCustomers = filteredCustomers.slice(
      nextPage * pageSize,
      (nextPage + 1) * pageSize
    );

    if (nextCustomers.length === 0) {
      setHasMore(false);
      return;
    }

    setVisibleCustomers(prev => [...prev, ...nextCustomers]);
    setPage(nextPage);
  };

  const totalPrice = filteredCustomers.reduce((total, customer) => {
    const detail = details.find(detail => detail.orderId === customer.orderId);
    return total + (detail?.totalPrice || 0);
  }, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add "Prime Laundry" as a text-based logo
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Prime Laundry', 10, 20);

    // Add title
    doc.setFontSize(16);
    doc.text('Customer Details Report', 10, 40);

    // Add table
    const tableRows = filteredCustomers.map(customer => {
      const detail = details.find(detail => detail.orderId === customer.orderId);
      return [
        customer.name,
        customer.orderId,
        detail?.dateOfDelivery
          ? new Date(detail.dateOfDelivery).toISOString().slice(0, 10)
          : 'N/A',
        new Date(customer.dateOfOrder).toISOString().slice(0, 10),
        detail?.totalPrice ? detail.totalPrice.toFixed(2) : '0.00',
        customer.phoneNumber,
        customer.address,
        customer.modeOfTransaction,
        customer.location,
        customer.query,
      ];
    });

    const tableHeaders = [
      'Name',
      'Order ID',
      'Date of Delivery',
      'Date of Order',
      'Amount',
      'Phone Number',
      'Address',
      'Mode of Transaction',
      'Location',
      'Query'
    ];

    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 8 },
      headerStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    // Add total price
    doc.setFontSize(12);
    doc.text(`Total Amount: INR ${totalPrice.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save('Customer_Details_Report.pdf');
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>

      {/* Search and Date Filters */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Name or Phone Number"
          className="p-2 border border-gray-300 rounded w-1/4"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </div>

      <div id="scrollableDiv" className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg">
        <InfiniteScroll
          dataLength={visibleCustomers.length}
          next={loadMoreCustomers}
          hasMore={hasMore}
          loader={
            <div className="text-center p-4 text-gray-500">
              Loading more customers...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-300">Name</th>
                <th className="py-2 px-4 border border-gray-300">Order ID</th>
                <th className="py-2 px-4 border border-gray-300">Date of Delivery</th>
                <th className="py-2 px-4 border border-gray-300">Date of Order</th>
                <th className="py-2 px-4 border border-gray-300">Amount</th>
                <th className="py-2 px-4 border border-gray-300">Phone Number</th>
                <th className="py-2 px-4 border border-gray-300">Address</th>
                <th className="py-2 px-4 border border-gray-300">Mode of Transaction</th>
                <th className="py-2 px-4 border border-gray-300">Location</th>
                <th className="py-2 px-4 border border-gray-300">Query</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((customer, index) => {
                const detail = details.find(detail => detail.orderId === customer.orderId);
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border border-gray-300">{customer.name}</td>
                    <td className="py-2 px-4 border border-gray-300">{customer.orderId}</td>
                    <td className="py-2 px-4 border border-gray-300">
                      {detail?.dateOfDelivery
                        ? new Date(detail.dateOfDelivery).toISOString().slice(0, 10)
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {new Date(customer.dateOfOrder).toISOString().slice(0, 10)}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {detail?.totalPrice ? detail.totalPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">{customer.phoneNumber}</td>
                    <td className="py-2 px-4 border border-gray-300">{customer.address}</td>
                    <td className="py-2 px-4 border border-gray-300">{customer.modeOfTransaction}</td>
                    <td className="py-2 px-4 border border-gray-300">{customer.location}</td>
                    <td className="py-2 px-4 border border-gray-300">{customer.query}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {/* Total Price */}
      <div className="mt-4 text-right">
        <span className="font-bold text-lg">Total Price: </span>
        <span className="font-bold text-lg">INR {totalPrice.toFixed(2)}</span>
      </div>

      {/* Download Button */}
      <div className="mt-4">
        {filteredCustomers.length > 0 && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerDirectory;