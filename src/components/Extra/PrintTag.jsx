import React from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react"; // Use named import
import ReactDOM from "react-dom"; // Import ReactDOM for dynamic rendering
import "./PrintTag.css";
import ProductTag from "./ProductTag";

const totalUnits = (subUnits) => {
  return subUnits.reduce((sum, num) => sum + num, 0);
};

const totalTagsCal = (units, subUnits) => {
  let totalUnits = 0;
  for (let i = 0; i < units.length; i++) {
    if (subUnits[i].length > 0) {
      totalUnits += subUnits[i].reduce((acc, val) => acc + val, 0);
    } else {
      totalUnits += units[i];
    }
  }
  return totalUnits;
};

function PrintTag() {
  const { state } = useLocation();
  const orderData = state?.orderData;

  if (!orderData) {
    return <p>No order data found.</p>;
  }

  const { orderId, name, dateOfDelivery, products, category, units, subUnits, delivery } =
    orderData;

  // Calculate total tags
  const totalTags = totalTagsCal(units, subUnits);

  // Global sequence counter
  let indexUnit = 0;
  const handleDownloadPDF = async () => {
    const buttons = document.querySelector(".button-container");
    buttons.style.display = "none";
  
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pageHeight = pdfHeight - 40; // Leave some margin at the bottom
  
    let currentY = 20; // Start 20 points from the top
    let tagsOnCurrentPage = 0; // Track the number of tags on the current page
  
    // Reset indexUnit before generating the PDF
    indexUnit = 0;
  
    for (let i = 0; i < products.length; i++) {
      const categoryTags = category[i];
      const unitCount =
        category[i].split(" ").pop() === "Kilowise"
          ? totalUnits(subUnits[i])
          : units[i];
  
      for (let seqIndex = 0; seqIndex < unitCount; seqIndex++) {
        const qrData = JSON.stringify({ orderId, sequence: `${indexUnit + 1}` });
  
        const tagHTML = `
          <div class="mx-auto rounded-md p-1 bg-white text-center" style="width: 4.5in; height: 5.3in;">
            <div class="text-[1.8rem] font-semibold">PRIME LAUNDRY</div>
            <div class="text-[3rem] font-bold font-sans mt-2">${orderId}</div>
            <div class="text-[1.75rem] font-semibold mt-2">${name.toUpperCase()}</div>
            <div class="text-[1.65rem] mt-2">${indexUnit + 1}/${totalTags}</div>
            <div class="text-[1.75rem] font-semibold">${categoryTags.toUpperCase()}</div>
            <div class="text-[2.1rem] font-semibold mt-2">${
              new Date(dateOfDelivery).toISOString().split("T")[0]
            }</div>
            <div class="text-[1.5rem] font-semibold">${delivery && "PD"}</div>
            <div class="mt-2 flex justify-center">
              <div id="qr-code-${i}-${seqIndex}"></div>
            </div>
            <div class="border-t border-dashed border-gray-500 mt-2"></div>
          </div>
        `;
  
        const tagContainer = document.createElement("div");
        tagContainer.innerHTML = tagHTML;
        document.body.appendChild(tagContainer);
  
        // Render QR code dynamically
        const qrCodeElement = tagContainer.querySelector(`#qr-code-${i}-${seqIndex}`);
        if (qrCodeElement) {
          ReactDOM.render(<QRCodeCanvas value={qrData} size={128} />, qrCodeElement);
        }
  
        // Wait for the QR code to render
        await new Promise((resolve) => setTimeout(resolve, 100)); // Add a small delay
  
        try {
          const canvas = await html2canvas(tagContainer, { scale: 0.4 });
          const imgData = canvas.toDataURL("image/jpeg", 0.7);
  
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          // Check if adding this tag would exceed the page height
          if (currentY + imgHeight > pageHeight) {
            pdf.addPage(); // Add a new page
            currentY = 20; // Reset Y position for the new page
            tagsOnCurrentPage = 0; // Reset the tag counter for the new page
          }
  
          // Add the tag to the PDF
          const xPosition = (pdfWidth - imgWidth) / 2;
          pdf.addImage(
            imgData,
            "PNG",
            xPosition,
            currentY,
            imgWidth,
            imgHeight
          );
  
          // Update Y position for the next tag
          currentY += imgHeight + 10; // Add a small gap between tags
          tagsOnCurrentPage++;
  
          // If 4 tags have been added to the current page, move to the next page
          if (tagsOnCurrentPage === 4) {
            pdf.addPage(); // Add a new page
            currentY = 20; // Reset Y position for the new page
            tagsOnCurrentPage = 0; // Reset the tag counter for the new page
          }
        } catch (error) {
          console.error("Error generating PDF tag:", error);
        } finally {
          document.body.removeChild(tagContainer);
        }
  
        // Increment the global sequence counter
        indexUnit++;
      }
    }
  
    pdf.save(`Order_${orderId}_Tags.pdf`);
    buttons.style.display = "flex";
  };

  return (
    <div className="flex flex-col items-center print-container">
      {products.map((product, index) =>
        Array.from(
          {
            length:
              category[index].split(" ").pop() === "Kilowise"
                ? totalUnits(subUnits[index])
                : units[index],
          },
          (_, seqIndex) => (
            <div key={`${product}-${seqIndex}`} className="tag-container">
              <ProductTag
                orderId={orderId}
                customerName={name}
                category={category[index]}
                sequence={`${++indexUnit}/${totalTags}`}
                dueDate={dateOfDelivery}
                delivery={delivery}
              />
            </div>
          )
        )
      )}
      <div className="mt-4 flex gap-2 button-container">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 no-print"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 no-print"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default PrintTag;