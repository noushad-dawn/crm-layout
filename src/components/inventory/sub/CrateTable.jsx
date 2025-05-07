import React, { useState } from "react";
import api from '../../../api/axios';

const CrateTable = () => {
  const [selectedCrate, setSelectedCrate] = useState("");
  const [crateData, setCrateData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCrateData([]);

    try {
      let response;
      if (selectedCrate === "all") {
        response = await api.get(`api/crates`);
      } else {
        response = await api.get(
          `api/crates/crate/${selectedCrate}`
        );
      }
      setCrateData(response.data.crates || [response.data.crate]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Crate(s) not found or there was an error fetching the data.");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold mb-4">Crates of Orders</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="crateNumber"
          >
            Select or Enter Crate
          </label>
          <input
            list="crateOptions"
            id="crateNumber"
            value={selectedCrate}
            onChange={(e) => setSelectedCrate(e.target.value)}
            placeholder="Type or select a crate (e.g., A00 or all)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <datalist id="crateOptions">
            {Array.from({ length: 26 }, (_, letterIndex) =>
              String.fromCharCode(65 + letterIndex)
            ).flatMap((letter) =>
              Array.from({ length: 100 }, (_, number) => {
                const crateNumber = `${letter}${number
                  .toString()
                  .padStart(2, "0")}`;
                return <option key={crateNumber} value={crateNumber} />;
              })
            )}
          </datalist>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading crate details...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {crateData.length > 0 && (
        <div className="crate-details mt-4">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          <div className="overflow-y-auto max-h-[40rem]">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead className="bg-gray-200 z-10 sticky top-0">
                <tr>
                  <th className="py-2 px-4 text-left">Crate Number</th>
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Products</th>
                  <th className="py-2 px-4 text-left">Units</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Total Price</th>
                  <th className="py-2 px-4 text-left">Date of Delivery</th>
                </tr>
              </thead>
              <tbody>
                {crateData.flatMap((crate) =>
                  crate.orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 px-4">{crate.crateNumber}</td>
                      <td className="py-2 px-4">{order.orderId}</td>
                      <td className="py-2 px-4">{order.category.join(", ")}</td>

                      <td className="py-2 px-4">
                        {order.products
                          .map((prod, index) => {
                            let unit = order.units[index];
                            let cat = order.category[index];
                            if (cat.includes("Kilowise")) {
                              unit = `${unit}KG`;
                            }
                            return `${prod}: ${unit}`;
                          })
                          .join(", ")}
                      </td>
                      <td className="py-2 px-4">
                        {order.units.reduce((sum, unit, i) => {
                          const subUnitTotal =
                            Array.isArray(order.subUnits[i]) &&
                            order.subUnits[i]
                              ? order.subUnits[i].reduce(
                                  (acc, val) => acc + val,
                                  0
                                )
                              : 0;
                          return sum + (subUnitTotal > 0 ? subUnitTotal : unit);
                        }, 0)}
                      </td>
                      <td className="py-2 px-4">{order.status}</td>
                      <td className="py-2 px-4">
                      ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(order.dateOfDelivery).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrateTable;
