// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import config from './config';

// const OrderTable = () => {
//     const [orders, setOrders] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Fetch data from the API
//         const fetchOrders = async () => {
//             try {
//                 const response = await fetch(`${config.baseURL}/api/orders`); 
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setOrders(data); 
//             } catch (error) {
//                 console.error('Error fetching orders:', error);
//             }
//         };

//         fetchOrders();
//     }, []);

//     const handleDownload = (order) => {
//         navigate(`/receipt/${order.orderId}`, { state: { orderData: order } });
//     };

//     const handlePrintTags = (order) => {
//         navigate(`/print-tag/${order.orderId}`, { state: { orderData: order, printTags: true } });
//     };

//     const filteredOrders = orders.filter(
//         (order) =>
//             order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             order.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search by Order ID or Name"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="mb-4 px-4 py-2 border border-gray-300 rounded"
//             />

//             <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-300">
//                     <thead>
//                         <tr>
//                             <th className="border border-gray-300 p-2">Order ID</th>
//                             <th className="border border-gray-300 p-2">Name</th>
//                             <th className="border border-gray-300 p-2">Phone Number</th>
//                             <th className="border border-gray-300 p-2">Invoice</th>
//                             <th className="border border-gray-300 p-2">Print Tags</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredOrders.map((order) => (
//                             <tr key={order._id}>
//                                 <td className="border border-gray-300 p-2">{order.orderId}</td>
//                                 <td className="border border-gray-300 p-2">{order.name}</td>
//                                 <td className="border border-gray-300 p-2">{order.phoneNumber}</td>
//                                 <td className="border border-gray-300 p-2">
//                                     <button
//                                         onClick={() => handleDownload(order)}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                                     >
//                                         Download
//                                     </button>
//                                 </td>
//                                 <td className="border border-gray-300 p-2">
//                                     <button
//                                         onClick={() => handlePrintTags(order)}
//                                         className="bg-green-500 text-white px-4 py-2 rounded"
//                                     >
//                                         Print Tags
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         {filteredOrders.length === 0 && (
//                             <tr>
//                                 <td className="border border-gray-300 p-2 text-center" colSpan="4">
//                                     No orders found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default OrderTable;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the API
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${config.baseURL}/api/orders`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleDownload = (order) => {
        navigate(`/receipt/${order.orderId}`, { state: { orderData: order } });
    };

    const handlePrintTags = (order) => {
        navigate(`/print-tag/${order.orderId}`, { state: { orderData: order, printTags: true } });
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search by Order ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-1/5"
            />

            {/* Scrollable container */}
            <div className="overflow-auto max-h-[400px] border border-gray-300 rounded">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="border border-gray-300 p-2">Order ID</th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Phone Number</th>
                            <th className="border border-gray-300 p-2">Invoice</th>
                            <th className="border border-gray-300 p-2">Print Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{order.orderId}</td>
                                <td className="border border-gray-300 p-2">{order.name}</td>
                                <td className="border border-gray-300 p-2">{order.phoneNumber}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleDownload(order)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Download
                                    </button>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handlePrintTags(order)}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Print Tags
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td className="border border-gray-300 p-2 text-center" colSpan="5">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
