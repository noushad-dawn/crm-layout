import api from "../../../api/axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const Receipt = () => {
  const location = useLocation();
  const { orderData } = location.state || {};
  const receiptRef = useRef();
  const [prices, setPrices] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [showPrinters, setShowPrinters] = useState(false);
  const [formData, setFormData] = useState({
    printerName: "",
    filePath: "",
    pageSize: "A6",
    scale: 100,
  });
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (orderData) fetchPrice();
    fetchCompany();
  }, [orderData]);

  const fetchCompany = async () => {
    try {
      const res = await api.get('/company');
      setCompany(res.data || null);
    } catch (err) {
      console.error('Error fetching company:', err);
      setCompany(null);
    }
  };

  const fetchPrice = async () => {
    try {
      const resp = await api.get(`api/services/`);
      const categories = resp.data;
      const priceList = orderData.products.map((product, index) => {
        const category = categories.find(
          (cat) => cat.serviceName === orderData.category[index]
        );
        const productInfo = category?.products.find(
          (p) => p.productName === product
        );
        return productInfo ? productInfo.price : 0;
      });
      setPrices(priceList);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  if (!orderData) {
    return <div>Order data not found.</div>;
  }

  const sendPdftoWhatsapp = async (pdfUrl) => {
    try {
      const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
      const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;
      const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(licenseNumber)}&APIKey=${encodeURIComponent(apiKey)}&Contact=${orderData.phoneNumber}&Template=invoicetest&Param=${orderData.name},${orderData.orderId}&Fileurl=${pdfUrl}&Name=${orderData.name}&PDFName=Receipt-${orderData.orderId}`;
      const response = await api.get(url);
      console.log(url);
      console.log(response.data);
      alert("Invoice message send successfully!");
    } catch (e) {
      alert("Error sending Invoice.");
      console.log(e);
    }
  };

  const uploadPdf = async (pdfBlob, willPrint) => {
    try {
      const formDataPdf = new FormData();
      formDataPdf.append("pdf", pdfBlob, "receipt.pdf");
      const response = await api.post(
        `api/invoice/upload-pdf`,
        formDataPdf,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const res = response.data.filePath;
        if (willPrint) {
          setFormData((prevData) => ({
            ...prevData,
            filePath: res,
          }));
          fetchPrinters();
        }
        else {
          sendPdftoWhatsapp(res);
        };
      } else {
        console.log("Failed to save pdf");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Error uploading PDF.");
    }
  };

  const fetchPrinters = async () => {
    try {
      const response = await api.get(`api/printers`);
      const data = response.data;
      setPrinters(data);
      setShowPrinters(true);
    } catch (error) {
      console.error("Error fetching printers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrint = async () => {
    console.log(formData);
    if (!formData.filePath || !formData.printerName) {
      alert("Please select a printer and enter a file path.");
      return;
    }

    const response = await api.post(`api/printers/print`, formData);
    const data = response.data;
    alert(data.success ? "Print job sent!" : `Error: ${data.error}`);
  };

  const printReceipt = () => {
    window.print();
  };

  const downloadPDF = (willPrint) => {
    const doc = new jsPDF({
      unit: "mm", 
      format: [210, 350],
    });

    doc.html(receiptRef.current, {
      callback: (doc) => {
        const pdfBlob = doc.output("blob");
        if (willPrint) {
          uploadPdf(pdfBlob, willPrint);
        } else {
          uploadPdf(pdfBlob, willPrint);
          doc.save("receipt.pdf");
        }
      },
      autoPaging: true,
      margin: [10, 10, 10, 10],
      html2canvas: { scale: 0.36 },
    });
  };

  const {
    orderId,
    name,
    address,
    phoneNumber,
    dateOfOrder,
    dateOfDelivery,
    category,
    products,
    units,
    garmentDetails = [],
    mode,
    totalPrice,
    discount,
    delivery,
    subUnits,
  } = orderData;

  const subtotal = products
    .map((_, index) => prices[index] * units[index] || 0)
    .reduce((acc, price) => acc + price, 0);

  const deliveryCharges = delivery ? 50 : 0;
  const total = subtotal + deliveryCharges - discount;
  const totalUnits = units.reduce((sum, unit, i) => {
    const subUnitTotal =
      Array.isArray(subUnits[i]) && subUnits[i]
        ? subUnits[i].reduce((acc, val) => acc + val, 0)
        : 0;
    return sum + (subUnitTotal > 0 ? subUnitTotal : unit);
  }, 0);

  return (
    <div>
      <div
        ref={receiptRef}
        className="receipt w-[5.5in] mx-auto p-4 bg-white shadow-md border border-gray-300 rounded-lg text-sm"
        style={{ display: "block" }}
      >
        {/* Company Header */}
        <div className="mb-2 flex justify-center">
          {company?.logo && (
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-30 h-20"
            />
          )}
        </div>
        {/* QR Code, Invoice Details, and Customer Details */}
        <div className="flex justify-between items-start">
          {/* QR Code */}
          <div className="mr-4">
            {company?.qrCode && (
              <img
                src={company.qrCode}
                alt="QR Code"
                className="w-20 h-20"
              />
            )}
          </div>
          {/* Invoice Details */}
          <div className="flex-1 text-left">
            <p className="text-gray-700 font-medium">Invoice No: {orderId}</p>
            <p className="text-gray-500">
              Date of Order: {new Date(dateOfOrder).toLocaleDateString()}
            </p>
            <p className="text-gray-500">
              Delivery Date: {new Date(dateOfDelivery).toLocaleDateString()}
            </p>
          </div>
          {/* Customer Details */}
          <div className="ml-4 text-left">
            <h3 className="font-semibold text-gray-700">Customer Details</h3>
            <p className="text-gray-500">{name}</p>
            <p className="text-gray-500">{address}</p>
            <p className="text-gray-500">{phoneNumber}</p>
          </div>
        </div>
        {/* Order Details */}
        <div className="mt-4 border-t pt-2">
          <h3 className="font-semibold text-lg text-gray-700">Order Details</h3>
          <table className="w-full text-left mt-1">
            <thead>
              <tr>
                <th className="border border-gray-300 text-lg p-2 pb-1">
                  Service
                </th>
                <th className="border border-gray-300 text-lg p-2 pb-1">
                  Product
                </th>
                <th className="border border-gray-300 text-lg p-2 pb-1">Qty</th>
                <th className="border border-gray-300 text-lg p-2 pb-1">
                  Price/Unit
                </th>
                <th className="border border-gray-300 text-lg p-2 pb-1">
                  Garments
                </th>
                <th className="border border-gray-300 text-lg p-2 pb-1">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > garmentDetails.length
                ? products.map((product, index) => (
                    <tr className="border-t" key={index}>
                      <td className="border border-gray-300 text-base p-2">
                        {category[index]}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {product}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {units[index]}
                        {category[index].split(" ").pop() === "Kilowise"
                          ? "KG"
                          : ""}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {prices[index]}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {garmentDetails[index]
                          ? Array.isArray(garmentDetails[index]) &&
                            garmentDetails[index].length > 1
                            ? garmentDetails[index]
                                .map((gd, i) => `${gd} : ${subUnits[index][i]}`)
                                .join(", ")
                            : garmentDetails[index]
                                .map((gd, i) => `${gd} : ${subUnits[index][i]}`)
                                .join(", ")
                          : "N/A"}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {prices[index] * units[index]
                          ? `INR ${(prices[index] * units[index]).toFixed(2)}`
                          : ""}
                      </td>
                    </tr>
                  ))
                : garmentDetails.map((garment, index) => (
                    <tr className="border-t" key={index}>
                      <td className="border border-gray-300 text-base p-2">
                        {category[index]}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {products[index]}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {units[index]}
                        {category[index].split(" ").pop() === "Kilowise"
                          ? "KG"
                          : ""}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {prices[index]}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {garmentDetails[index]
                          ? Array.isArray(garmentDetails[index]) &&
                            garmentDetails[index].length > 1
                            ? garmentDetails[index]
                                .map((gd, i) => `${gd} : ${subUnits[index][i]}`)
                                .join(", ")
                            : garmentDetails[index]
                                .map((gd, i) => `${gd} : ${subUnits[index][i]}`)
                                .join(", ")
                          : "N/A"}
                      </td>
                      <td className="border border-gray-300 text-base p-2">
                        {prices[index] * units[index]
                          ? `INR ${(prices[index] * units[index]).toFixed(2)}`
                          : ""}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="font-semibold text-lg">
            Pickup & Delivery Charges
          </span>
          <span className="font-semibold text-lg">INR {deliveryCharges}</span>
        </div>
        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="font-semibold text-lg">Discount*</span>
          <span className="font-semibold text-lg">- INR {discount}</span>
        </div>
        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="font-bold text-lg">Total Units</span>
          <span className="font-bold text-lg">{totalUnits}</span>
        </div>

        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-lg">INR {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => downloadPDF(false)}
          className="bg-blue-500 text-white px-4 py-2 my-5 rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
        <button
          onClick={printReceipt}
          className="bg-green-500 text-white px-4 py-2 my-5 rounded hover:bg-green-600"
        >
          Print PDF
        </button>
        <button
          onClick={() => downloadPDF(true)}
          className="bg-green-500 text-white px-4 py-2 my-5 rounded hover:bg-green-600"
        >
          New Print PDF
        </button>
      </div>
      {showPrinters && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePrint();
          }}
          className="bg-white p-6 rounded-lg shadow-lg w-96"
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Select Printer
          </h3>
          <select
            name="printerName"
            value={formData.printerName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          >
            <option value="">Select Printer</option>
            {printers.map((printer, index) => (
              <option key={index} value={printer}>
                {printer}
              </option>
            ))}
          </select>

          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Print Settings
          </h3>
          <input
            type="text"
            name="filePath"
            value={formData.filePath}
            onChange={handleChange}
            readOnly
            disabled
            className="w-full p-2 border rounded-md mb-3"
          />

          <label className="block font-medium text-gray-600 mb-1">
            Page Size:
          </label>
          <select
            name="pageSize"
            value={formData.pageSize}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="A5">A5</option>
          </select>

          <label className="block font-medium text-gray-600 mb-1">
            Scale (%):
          </label>
          <input
            type="number"
            name="scale"
            defaultValue={formData.scale}
            value={formData.scale}
            min="10"
            max="200"
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
          >
            Submit Print Job
          </button>
        </form>
      )}
      <style>{`
                 @media print {
    body * {
        visibility: hidden;
    }
    .receipt, .receipt * {
        visibility: visible;
    }
    .receipt {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
    }
    @page {
        size: 5.5in 8.5in;
        margin: 0;
    }
}
              `}</style>
    </div>
  );
};

export default Receipt;