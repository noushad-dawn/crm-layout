import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import config from "../config";

const OrderTable = () => {
    const [orders, setOrders] = useState([]); // All orders (unchanged by filter)
    const [filteredOrders, setFilteredOrders] = useState([]); // Orders after filtering
    const [visibleOrders, setVisibleOrders] = useState([]); // Orders displayed based on pagination
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [page, setPage] = useState(1); // Pagination page
    const [hasMore, setHasMore] = useState(true); // For infinite scroll
    const navigate = useNavigate();
    const pageSize = 10; // Number of orders to load at a time

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${config.baseURL}/api/orders`);
                if (!response.ok) throw new Error("Network error");
                const data = await response.json();
                setOrders(data);
                setFilteredOrders(data); // Initially, show all orders
                setVisibleOrders(data.slice(0, pageSize)); // Load first batch
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const loadMoreOrders = () => {
        const nextPage = page + 1;
        const nextOrders = filteredOrders.slice(page * pageSize, nextPage * pageSize);

        if (nextOrders.length === 0) {
            setHasMore(false);
            return;
        }

        setVisibleOrders((prev) => [...prev, ...nextOrders]);
        setPage(nextPage);
    };

    const handleDownload = (order) => {
        navigate(`/receipt/${order.orderId}`, { state: { orderData: order } });
    };

    const handlePrintTags = (order) => {
        navigate(`/print-tag/${order.orderId}`, { state: { orderData: order, printTags: true } });
    };

    // Filter orders based on the search term
    useEffect(() => {
        const filtered = orders.filter(
            (order) =>
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
        setVisibleOrders(filtered.slice(0, pageSize)); // Reset the visible orders when filtering
        setPage(1); // Reset page number to 1 after filter
        setHasMore(filtered.length > pageSize); // Check if there are more orders to load
    }, [searchTerm, orders]);

    return (
        <div className="p-4">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by Order ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full text-sm"
            />

            {/* Scrollable container with Infinite Scroll */}
            <div id="scrollableDiv" className="overflow-y-auto max-h-[400px] border border-gray-300 rounded">
                <InfiniteScroll
                    dataLength={visibleOrders.length}
                    next={loadMoreOrders}
                    hasMore={hasMore}
                    loader={<p className="text-center p-2 text-sm">Loading more orders...</p>}
                    scrollableTarget="scrollableDiv"
                >
                    {/* Responsive Table Container */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="border border-gray-300 p-2">Order ID</th>
                                    <th className="border border-gray-300 p-2">Name</th>
                                    <th className="border border-gray-300 p-2 hidden md:table-cell">Phone</th>
                                    <th className="border border-gray-300 p-2">Invoice</th>
                                    <th className="border border-gray-300 p-2 hidden md:table-cell">Print Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{order.orderId}</td>
                                        <td className="border border-gray-300 p-2">{order.name}</td>
                                        <td className="border border-gray-300 p-2 hidden md:table-cell">{order.phoneNumber}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleDownload(order)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Download
                                            </button>
                                        </td>
                                        <td className="border border-gray-300 p-2 hidden md:table-cell">
                                            <button
                                                onClick={() => handlePrintTags(order)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Print Tags
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {visibleOrders.length === 0 && (
                                    <tr>
                                        <td className="border border-gray-300 p-2 text-center text-sm" colSpan="5">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default OrderTable;
