import React from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./PrintTag.css";

function ProductTag({ orderId, customerName, category, sequence, dueDate, delivery}) {
  return (
    <div
      className="border border-gray-300 rounded-md p-1 bg-white text-center"
      style={{ width: "4.5in", height: "3.9in", overflow: "hidden" }}
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
      </div>
  );
}

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
  let indexUnit = 0;
  const { state } = useLocation();
  const orderData = state?.orderData;

  if (!orderData) {
    return <p>No order data found.</p>;
  }

  const { orderId, name, dateOfDelivery, products, category, units, subUnits, delivery } =
    orderData;

  const handleDownloadPDF = async () => {
    const buttons = document.querySelector(".button-container");
    buttons.style.display = "none";

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pageHeight = pdfHeight - 40;

    let currentY = 20;

    for (let i = 0; i < products.length; i++) {
      const categoryTags = category[i];
      const unitCount =
        category[i].split(" ").pop() === "Kilowise"
          ? totalUnits(subUnits[i])
          : units[i];

      for (let seqIndex = 0; seqIndex < unitCount; seqIndex++) {
        const tagHTML = `
          <div class="border mx-auto border-gray-300 rounded-md p-1 bg-white text-center" style="width: 4.5in; height: 3.9in;">
            <div class="text-[1.8rem] font-semibold">PRIME LAUNDRY</div>
            <div class="text-[3rem] font-bold font-sans mt-2">${orderId}</div>
            <div class="text-[1.75rem] font-semibold mt-2">${name.toUpperCase()}</div>
            <div class="text-[1.65rem] mt-2">${seqIndex + 1}/${unitCount}</div>
            <div class="text-[1.75rem] font-semibold">${categoryTags.toUpperCase()}</div>
            <div class="text-[2.1rem] font-semibold mt-2">${
              new Date(dateOfDelivery).toISOString().split("T")[0]
            }</div>
            <div class="text-[1.5rem] font-semibold">${delivery && "PD"}</div>
            </div>
          
        `;

        const tagContainer = document.createElement("div");
        tagContainer.innerHTML = tagHTML;
        document.body.appendChild(tagContainer);

        try {
          const canvas = await html2canvas(tagContainer, { scale: 0.4 }); // Reduced scale
          const imgData = canvas.toDataURL("image/jpeg", 0.7); // Change to 'image/jpeg' with quality

          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (currentY + imgHeight > pageHeight) {
            pdf.addPage();
            currentY = 20;
          }

          const xPosition = (pdfWidth - imgWidth) / 2;
          pdf.addImage(
            imgData,
            "PNG",
            xPosition,
            currentY,
            imgWidth,
            imgHeight
          );
          currentY += imgHeight + 10;
        } catch (error) {
          console.error("Error generating PDF tag:", error);
        } finally {
          document.body.removeChild(tagContainer);
        }
      }
    }

    pdf.save(`Order_${orderId}_Tags.pdf`);
    buttons.style.display = "flex";
  };

  const totalTags = totalTagsCal(units, subUnits);

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
