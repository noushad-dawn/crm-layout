import React, { useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

const QR = () => {
    const [loading, setLoading] = useState(false);

    const orderData = {
        orderId: "A1028_001",
        name: "test1",
        dateOfOrder: "2024-10-28T00:00:00.000Z",
        category: ["Dry Cleaning Kilowise", "Regular Iron"],
    };

    const generateQRCode = async (data) => {
        try {
            const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(data));
            return qrCodeUrl;
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const generateTags = async (orderData, sequenceCount) => {
        const tags = [];
        for (let i = 1; i <= sequenceCount; i++) {
            const sequence = `${i}/${sequenceCount}`;
            const qrData = {
                customerName: orderData.name,
                orderId: orderData.orderId,
                sequence: sequence,
            };
            const qrCodeUrl = await generateQRCode(qrData);
            tags.push({
                ...orderData,
                sequence,
                qrCodeUrl,
            });
        }
        return tags;
    };

    const downloadTagsAsPDF = async () => {
        setLoading(true);
        const sequenceCount = 7; // Number of sequences
        const tags = await generateTags(orderData, sequenceCount);
        const doc = new jsPDF();
        tags.forEach((tag, index) => {
            if (index > 0) doc.addPage();
            doc.setFontSize(12);
            doc.text(`Prime Laundry`, 10, 10);
            doc.text(`Order ID: ${tag.orderId}`, 10, 20);
            doc.text(`Customer Name: ${tag.name}`, 10, 30);
            doc.text(`Sequence: ${tag.sequence}`, 10, 40);
            doc.text(`Date: ${new Date(tag.dateOfOrder).toLocaleDateString()}`, 10, 50);
            doc.text(`Category: ${tag.category.join(", ")}`, 10, 60);
            doc.addImage(tag.qrCodeUrl, 'PNG', 10, 70, 50, 50); // Add QR code
        });
        doc.save('tags.pdf');
        setLoading(false);
    };

    return (
        <div>
            <h1>Generate Tags with QR Codes</h1>
            <button onClick={downloadTagsAsPDF} disabled={loading}>
                {loading ? 'Generating...' : 'Download Tags as PDF'}
            </button>
        </div>
    );
};

export default QR;

// Dekh toh ye wala component vs code me aur apne tag wale component se compare kar