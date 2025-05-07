import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import config from './config';
const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get(`api/customers`);
                setCustomers(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading customers...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Customers List</h2>
            <ul className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
                {customers.length === 0 ? (
                    <li>No customers available.</li>
                ) : (
                    customers.map(customer => (
                        <li key={customer._id} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span>{customer.name}</span>
                            <span>{customer.phoneNumber}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default CustomersList;
