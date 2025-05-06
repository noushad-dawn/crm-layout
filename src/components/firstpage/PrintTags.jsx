import React from 'react';
import { jsPDF } from 'jspdf';

const PrintTags = ({ orders }) => {
    const generatePDF = (order) => {
      const doc = new jsPDF();
      const { orderId, category, products, units } = order;
      const splitOrderId = orderId.split('_')[1];
  
      doc.setFontSize(18);
      doc.text('Product Tags', 10, 10);
  
      Array.from({ length: units }, (_, index) => {
        const tagContent = `
          Full Order ID: ${orderId}
          Sequence ID: ${splitOrderId}
          Category: ${category}
          Product Name: ${products}
          Quantity: ${index + 1}/${units}
        `;
        
        const yPosition = 30 + index * 40;
        
        doc.setFontSize(12);
        doc.text(tagContent, 10, yPosition);
      });
  
      // Save the PDF
      doc.save('tags.pdf');
    };
  
    return (
      <div className="p-6 flex flex-col items-center">
      {/* Orders Table */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Tag ID</th>
            <th className="border border-gray-300 p-2">Units</th>
            <th className="border border-gray-300 p-2">Download</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="bg-white hover:bg-gray-100">
              {/* Tag ID Column */}
              <td className="border border-gray-300 p-2">{order.orderId}</td>
              <td className="border border-gray-300 p-2">{order.units}</td>
              
              {/* Download Button Column */}
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => generatePDF(order)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
                >
                  Download Tags
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    );
  };
   
  export default PrintTags;