import api from '../../api/axios';
import React, { useEffect, useState } from 'react';
import config from '../config';

const CustomerDirectory = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const response = await api.get(`api/customers`);
      setCustomers(response.data.customers || []);
      setDetails(response.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter customers based on search input for either name or phone number
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="p-4 mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>
      
      {/* Single Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Phone Number"
          className="p-2 border border-gray-300 w-1/4 rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border border-gray-300">Name</th>
            <th className="py-2 px-4 border border-gray-300">Order ID</th>
            <th className="py-2 px-4 border border-gray-300">Date of Payment</th>
            <th className="py-2 px-4 border border-gray-300">Date of Order</th>
            <th className="py-2 px-4 border border-gray-300">Amount</th>
            <th className="py-2 px-4 border border-gray-300">Address</th>
            <th className="py-2 px-4 border border-gray-300">Phone Number</th>
            <th className="py-2 px-4 border border-gray-300">Mode of Transaction</th>
            <th className="py-2 px-4 border border-gray-300">Location</th>
            <th className="py-2 px-4 border border-gray-300">Query</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">{customer.name}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.orderId}</td>
              <td className="py-2 px-4 border border-gray-300">{new Date(customer.dateOfPayment)
                          .toISOString()
                          .slice(0, 10)}</td>
              <td className="py-2 px-4 border border-gray-300">{new Date(customer.dateOfOrder)
                          .toISOString()
                          .slice(0, 10)}</td>
              <td className="py-2 px-4 border border-gray-300">{details[index]?.totalPrice.toFixed(2)}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.address}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.phoneNumber}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.modeOfTransaction}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.location}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDirectory;
