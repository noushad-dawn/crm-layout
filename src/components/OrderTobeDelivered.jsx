// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import config from './config';

// const OrderToBeDelivered = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get(`${config.baseURL}/api/orders`);
//                 setOrders(response.data);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchOrders();
//     }, [orders]);

//     const assignOrder = async (orderId) => {
//         try {
//             // Send POST request to assign the order to a driver
//             const response = await axios.post(`${config.baseURL}/api/orders/assign/${orderId}`);
//             alert(response.data.message);
//         } catch (error) {
//             console.error('Error assigning driver:', error);
//         }
//     };

//     if (loading) {
//         return <div className="text-center p-4">Loading orders...</div>;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <h2 className="text-2xl font-bold mb-4">Orders To be Delivered</h2>
//             <table className="min-w-full bg-white shadow-md rounded">
//                 <thead>
//                     <tr>
//                         <th className="py-2 px-4 bg-gray-100">Name</th>
//                         <th className="py-2 px-4 bg-gray-100">Category</th>
//                         <th className="py-2 px-4 bg-gray-100">Phone Number</th>
//                         <th className="py-2 px-4 bg-gray-100">Product</th>
//                         <th className="py-2 px-4 bg-gray-100">Address</th>
//                         <th className="py-2 px-4 bg-gray-100">Location</th>
//                         <th className="py-2 px-4 bg-gray-100">Units</th>
//                         <th className="py-2 px-4 bg-gray-100">Total Price</th>
//                         <th className="py-2 px-4 bg-gray-100">Payment Method</th>
//                         <th className="py-2 px-4 bg-gray-100">Assign</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders.filter((order)=>order.status == 'Ready to be Delivered').map(order => (
//                         <tr key={order._id} className="border-b">
//                             <td className="py-2 px-4">{order.name}</td>
//                             <td className="py-2 px-4">{order.category}</td>
//                             <td className="py-2 px-4">{order.phoneNumber}</td>
//                             <td className="py-2 px-4">{order.products}</td>
//                             <td className="py-2 px-4">{order.address}</td>
//                             <td className="py-2 px-4">{order.location}</td>
//                             <td className="py-2 px-4">{order.units}</td>
//                             <td className="py-2 px-4">{order.totalPrice.toFixed(2)}</td>
//                             <td className="py-2 px-4">{order.mode}</td>
//                             <td className="py-2 px-4">
//                                 {!order.assigned ? (
//                                     <button
//                                         onClick={() => assignOrder(order.orderId)}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                                     >
//                                         Assign
//                                     </button>
//                                 ) : (
//                                     <span className="text-green-500">Assigned</span>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
    
// };

// export default OrderToBeDelivered;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';

const OrderToBeDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${config.baseURL}/api/orders`);
                console.log('Orders Fetched:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert(`Error fetching orders: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); 

    const assignOrder = async (orderId) => {
        try {
            const response = await axios.post(`${config.baseURL}/api/orders/assign/${orderId}`);
            alert(response.data.message);
        } catch (error) {
            console.error('Error assigning driver:', error);
            alert(`Error assigning driver: ${error.message}`);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Orders To be Delivered</h2>
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr>
                        <th className="py-2 px-4 bg-gray-100">Name</th>
                        <th className="py-2 px-4 bg-gray-100">Category</th>
                        <th className="py-2 px-4 bg-gray-100">Phone Number</th>
                        <th className="py-2 px-4 bg-gray-100">Product</th>
                        <th className="py-2 px-4 bg-gray-100">Address</th>
                        <th className="py-2 px-4 bg-gray-100">Location</th>
                        <th className="py-2 px-4 bg-gray-100">Units</th>
                        <th className="py-2 px-4 bg-gray-100">Total Price</th>
                        <th className="py-2 px-4 bg-gray-100">Payment Method</th>
                        <th className="py-2 px-4 bg-gray-100">Assign</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.filter((order) => order.status === 'Ready to be Delivered').map((order) => (
                        <tr key={order._id} className="border-b">
                            <td className="py-2 px-4">{order.name}</td>
                            <td className="py-2 px-4">{order.category}</td>
                            <td className="py-2 px-4">{order.phoneNumber}</td>
                            <td className="py-2 px-4">{order.products}</td>
                            <td className="py-2 px-4">{order.address}</td>
                            <td className="py-2 px-4">{order.location}</td>
                            <td className="py-2 px-4">{order.units}</td>
                            <td className="py-2 px-4">{order.totalPrice.toFixed(2)}</td>
                            <td className="py-2 px-4">{order.mode}</td>
                            <td className="py-2 px-4">
                                {!order.assigned ? (
                                    <button
                                        onClick={() => assignOrder(order._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Assign
                                    </button>
                                ) : (
                                    <span className="text-green-500">Assigned</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderToBeDelivered;
