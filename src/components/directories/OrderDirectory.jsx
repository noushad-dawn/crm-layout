import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';


const OrderDirectory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${config.baseURL}/api/orders`);
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [orders]);

    const calculateTAT = (dateOfDelivery) => {
        const currentDate = new Date();
        const deliveryDate = new Date(dateOfDelivery);
    
        const timeDifference = deliveryDate - currentDate;
    
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

   

    if (loading) {
        return <div className="text-center p-4">Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Order Directory</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 bg-gray-100 text-left">Order ID</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Date of Order</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Date of Delivery</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">TAT</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Product</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Category</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Units</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Price Per Units</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Total Price</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Customer Name</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Phone Number</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Address</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Location</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const daysLeft = calculateTAT(order.dateOfDelivery);
                        const tatDisplay = formatTAT(daysLeft);
                        return(
                        <tr key={order._id} className="border-b">
                            <td className="py-2 px-4">{order.orderId}</td>
                            <td className="py-2 px-4">{new Date(order.dateOfOrder).toISOString().slice(0, 10)}</td>
                            <td className="py-2 px-4">{new Date(order.dateOfDelivery).toISOString().slice(0, 10)}</td>
                            <td className="py-2 px-4">{tatDisplay}</td>
                            <td className="py-2 px-4">{order.products.join(', ')}</td>
                            <td className="py-2 px-4">{order.category.join(', ')}</td>
                            <td className="py-2 px-4">{order.units.reduce((acc, curr) => acc + curr, 0)}</td>
                            <td className="py-2 px-4">{(order.totalPrice/order.units).toFixed(2)}</td>
                            <td className="py-2 px-4">{order.totalPrice.toFixed(2)}</td>
                            <td className="py-2 px-4">{order.name}</td>
                            <td className="py-2 px-4">{order.phoneNumber}</td>
                            <td className="py-2 px-4">{order.address}</td>
                            <td className="py-2 px-4">{order.location}</td>
                            <td className="py-2 px-4">{order.status}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDirectory;
