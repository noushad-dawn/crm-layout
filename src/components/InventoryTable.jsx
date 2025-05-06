import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('delivered'); // Example status for filtering orders
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/orders`);
      const data = response.data || [];
      const filteredData = data.filter((item)=>{
        item.status !== 'On route'&&
        item.status !== 'Delivered'
      })
      setData(filteredData||[]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };
  // Lock an order
  const lockOrder = async (orderId) => {
    try {
      const response = await axios.patch(`${config.baseURL}/api/orders/lock-order/${orderId}`);
      alert(response.data.message);
      fetchOrders();
    } catch (error) {
      console.error('Error locking order:', error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Phone No.</th>
            <th className="py-2 px-4 border-b">Products</th>
            <th className="py-2 px-4 border-b">Total Price</th>
            <th className="py-2 px-4 border-b">Units</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.orderId} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.products}</td>
              <td className="py-2 px-4 border-b">{item.orderId}</td>
              <td className="py-2 px-4 border-b">{item.userID}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.phoneNumber}</td>
              <td className="py-2 px-4 border-b">{item.products}</td>
              <td className="py-2 px-4 border-b">{item.totalPrice}</td>
              <td className="py-2 px-4 border-b">{item.units}</td>
              <td className="py-2 px-4 border-b">{item.category}</td>
              <td className="py-2 px-4 border-b">{item.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => lockOrder(item.orderId)}
                  className={`px-4 py-2 rounded text-white ${
                    item.lock ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={item.lock}
                >
                  {item.lock ? 'Locked' : 'Lock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;