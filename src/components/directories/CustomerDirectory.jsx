import React, { useEffect, useState } from 'react';
import config from '../config';
import api from '../../api/axios';
const CustomerDirectory = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
  try {
    const response = await api.get(`api/customers`);
    setCustomers(response.data || []);
  } catch (error) {
    console.log(error);
  }
  }
  

  return (
    <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Customer List</h2>
            <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border border-gray-300">Name</th>
            <th className="py-2 px-4 border border-gray-300">Order ID</th>
            <th className="py-2 px-4 border border-gray-300">Date of Payment</th>
            <th className="py-2 px-4 border border-gray-300">Date of Order</th>
            <th className="py-2 px-4 border border-gray-300">Address</th>
            <th className="py-2 px-4 border border-gray-300">Phone Number</th>
            <th className="py-2 px-4 border border-gray-300">Mode of Transaction</th>
            <th className="py-2 px-4 border border-gray-300">Location</th>
            <th className="py-2 px-4 border border-gray-300">Query</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">{customer.name}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.orderId}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.dateOfPayment}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.dateOfOrder}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.address}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.phoneNumber}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.modeOfTransaction}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.location}</td>
              <td className="py-2 px-4 border border-gray-300">{customer.query}</td>
            </tr>
          ))}
        </tbody>
    </div>
  );
};

export default CustomerDirectory;
