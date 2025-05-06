import React from 'react'
import { jsPDF } from 'jspdf';

 const PrintTable = ({orders}) => {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title for the PDF
        doc.text('Orders Details', 14, 20);

        // Define the table structure with headers and rows
        const tableColumn = ["Order ID", "Name", "Category", "Units", "Total Price"];
        const tableRows = orders.map(order => [
            order.orderId,
            order.name,
            order.category,
            order.units,
            order.totalPrice
        ]);
  
        // Generate the table in the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30, // To give space for the title at the top
        });

        // Save the PDF
        doc.save('orders_data.pdf');
    };

  return (
    <button
        onClick={generatePDF}
        className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all"
      >
        Download Orders Table as PDF
      </button>
  )
}

export default PrintTable