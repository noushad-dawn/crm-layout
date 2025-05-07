import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // Use named import

function ProductTag({ orderId, customerName, category, sequence, dueDate, delivery }) {
    // Extract the sequence number from the sequence string (e.g., "1/21" -> 1)
    const sequenceNumber = sequence.split("/")[0];

    // QR code data contains only the sequence number (e.g., 1, 2, 3, etc.)
    const qrData = JSON.stringify({ orderId, sequence: sequenceNumber });

    return (
        <div
            className="border-b border-dashed border-gray-300 rounded-md p-1 bg-white text-center"
            style={{ width: "4.5in", height: "4.9in", overflow: "hidden" }}
        >
            <div className="text-[1.8rem] font-semibold">PRIME LAUNDRY</div>
            <div
                className="text-[3rem] font-bold font-sans mt-2"
                style={{ overflowWrap: "break-word", lineHeight: "1.2" }}
            >
                {orderId}
            </div>
            <div
                className="text-[1.75rem] font-semibold mt-2"
                style={{ overflowWrap: "break-word", lineHeight: "1.2" }}
            >
                {customerName.toUpperCase()}
            </div>
            <div
                className="text-[1.65rem] mt-2"
                style={{ overflowWrap: "break-word", lineHeight: "1.2" }}
            >
                {sequence}
            </div>
            <div
                className="text-[1.75rem] font-semibold"
                style={{ overflowWrap: "break-word", lineHeight: "1.2" }}
            >
                {category.toUpperCase()}
            </div>
            <div
                className="text-[2.1rem] font-semibold mt-2"
                style={{ overflowWrap: "break-word", lineHeight: "1.2" }}
            >
                {new Date(dueDate).toISOString().split("T")[0]}
            </div>
            <div className="text-[1.5rem] font-semibold mt-2">{delivery && "PD"}</div>
            <div className="mt-2 flex justify-center">
                <QRCodeCanvas value={qrData} size={135} /> {/* Use QRCodeCanvas */}
            </div>
            <div className="mt-2"></div>
        </div>
    );
}

export default ProductTag;