
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from './config';
import api from '../api/axios';


const PaymentTable = () => {
    const [data, setData] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    useEffect(() => {
        fetchData();
    }, [searchTerm]); // <-- refetch when searchTerm changes

    const fetchData = () => {
        const url = searchTerm
            ? `api/orders?search=${encodeURIComponent(searchTerm)}`
            : `api/orders`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setVisibleOrders(data.slice(0, 10));
                setHasMore(data.length > 10);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const loadMoreOrders = () => {
        if (visibleOrders.length >= data.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setVisibleOrders((prev) => [
                ...prev,
                ...data.slice(prev.length, prev.length + 10),
            ]);
        }, 200);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const sendPaymentStatus = async (order) => {
        const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
        const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;
        const contact = order.phoneNumber.trim();
        const template = 'payment_customerr';
        const name = order.name.trim();
        const url1 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(contact)}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.category.join('; '))},${encodeURIComponent(order.garmentDetails.flat().join('; ') || 'none')},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
        api.get(url1).then((response) => {
            console.log('Response:', response.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
        const url2 = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent("8234012896")}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(order.totalPrice.toFixed(2))},${encodeURIComponent(order.orderId)},${encodeURIComponent(order.category.join('; '))},${encodeURIComponent(order.garmentDetails.flat().join('; ') || 'none')},${encodeURIComponent(selectedPaymentMethod)}&Name=${encodeURIComponent(name)}`;
        api.get(url2).then((response) => {
            console.log('Response:', response.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleConfirmPaymentMethod = async () => {
        const id = selectedOrder.orderId;
        try {
            const response = await api.post(`api/orders/updatePaymentMode/${id}`, {
                paymentMode: selectedPaymentMethod,
            });

            if (response.status === 200) {
                alert(`Payment Mode for Order ID ${id} has been changed to ${selectedPaymentMethod}.`);
            } else {
                alert(`Failed to update payment status for Order ID ${id}.`);
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('An error occurred while updating the payment status.');
        }
        try {
            const response = await api.post(`api/orders/updatePaymentStatus/${id}`, {
                paymentStatus: selectedStatus,
            });

            if (response.status === 200) {
                alert(`Payment status for Order ID ${id} has been changed to ${selectedStatus}.`);
                sendPaymentStatus(selectedOrder);
            } else {
                alert(`Failed to update payment status for Order ID ${id}.`);
            }

            fetchData();
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('An error occurred while updating the payment status.');
        }
        setShowPopup(false);
    };

    const handlePaymentStatusChange = async (order, newStatus) => {
        setSelectedOrder(order);
        setSelectedStatus(newStatus);
        setShowPopup(true);
    };

    return (
        <div className="container mx-auto p-6 mt-8">
            <h1 className="text-2xl font-bold mb-4 text-left">Payment Status Table</h1>
            <input
                type="text"
                placeholder="Search by Name, Order ID or Phone Number"
                className="mb-6 p-3 border border-gray-300 rounded w-1/4 shadow"
                value={searchTerm}
                onChange={handleSearch}
            />
            <div id="scrollableDiv" className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-lg rounded-lg">
                <InfiniteScroll
                    dataLength={visibleOrders.length}
                    next={loadMoreOrders}
                    hasMore={hasMore}
                    loader={
                        <div className="text-center p-4 text-gray-500">
                            Loading more orders...
                        </div>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <table className="min-w-full bg-white shadow-md rounded border-collapse">
                        <thead>
                            <tr>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Order ID</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Name</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Phone Number</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Payment Mode</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Total Amount</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Paid Amount</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Due Amount</th>
                                <th className="py-3 px-6 bg-gray-200 text-gray-600 text-left text-sm uppercase font-bold border-b">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleOrders.length > 0 ? (
                                visibleOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-100">
                                        <td className="py-3 px-6 border-b">{order.orderId}</td>
                                        <td className="py-3 px-6 border-b">{order.name}</td>
                                        <td className="py-3 px-6 border-b">{order.phoneNumber}</td>
                                        <td className="py-3 px-6 border-b">{order.mode}</td>
                                        <td className="py-3 px-6 border-b">₹{order.totalPrice.toFixed(2)}</td>
                                        <td className="py-3 px-6 border-b">₹{order.paymentStatus === 'Completed' ? order.totalPrice.toFixed(2) : 0}</td>
                                        <td className="py-3 px-6 border-b">₹{order.paymentStatus === 'Completed' ? 0 : order.totalPrice.toFixed(2)}</td>
                                        <td className="py-3 px-6 border-b">
                                            <select
                                                value={order.paymentStatus}
                                                onChange={(e) => handlePaymentStatusChange(order, e.target.value)}
                                                disabled={order.paymentStatus === 'Completed'}
                                                className="border border-gray-300 rounded p-2 shadow"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Failed">Failed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
                        <div>
                            <label className="block mb-2">Payment Method</label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={handlePaymentMethodChange}
                                className="border border-gray-300 rounded p-2 w-full mb-4"
                            >
                                <option value="">Select Method</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Online">Online</option>
                            </select>
                            <button
                                onClick={handleConfirmPaymentMethod}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentTable;
