import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import config from '../config';

const DownloadOrders = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orders, setOrders] = useState([]);
    // Handle date change
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Fetch orders from backend and filter them based on date range
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${config.baseURL}/api/orders`);
            const allOrders = response.data;

            // Filter orders between selected dates
            const filteredOrders = allOrders.filter(order => {
                const orderDate = new Date(order.dateOfDelivery);
                const start = new Date(startDate);
                const end = endDate ? new Date(endDate) : new Date(); // Default to today if no end date is given

                return orderDate >= start && orderDate <= end;
            });

            generatePDF(filteredOrders);
        } catch (error) {
            console.error('Error fetching orders from backend:', error);
        }
    };

    // Generate PDF for filtered orders
    const generatePDF = (ordersData) => {
        const doc = new jsPDF();
        doc.text('Orders Report', 14, 10);

        const tableData = ordersData.map(order => [
            order.orderId,
            order.orderOfDelivary,
            order.address,
            order.phoneNumber,
            order.location,
            order.userId,
            order.assigned,
            order.route
        ]);

        doc.autoTable({
            head: [['Order ID', 'Delivery Date', 'Address', 'Phone', 'Location', 'User ID', 'Assigned', 'Route']],
            body: tableData,
        });

        doc.save('orders-report.pdf');
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Download Orders</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="startDate">
                    Start Date:
                </label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="endDate">
                    End Date (Optional):
                </label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="p-2 border rounded w-full"
                />
            </div>

            {startDate && (
                <button
                    onClick={fetchOrders}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Download Orders
                </button>
            )}
        </div>
    );
};

export default DownloadOrders;
