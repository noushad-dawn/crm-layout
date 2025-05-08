import React, { useEffect, useState } from "react";
import api from '../../../api/axios';
import Select, { components } from "react-select";
import generateNewOrderId from "../../RandomIdGeneratror";
import OrderTable from "../../Extra/OrderTable2";

const OrderForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [garmentList, setGarmentList] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    units: "",
  });
  const [selectedSubProducts, setSelectedSubProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  // Array to store multiple products
  const [orders, setOrders] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [category, setCategory] = useState({
    categoryName: "",
    categoryId: "",
  });

  // const garments = garmentList.list;
  const [locations, setLocations] = useState([]);
  const [selectedGarments, setSelectedGarments] = useState([]);

  const [suggestions, setSuggestions] = useState({ name: [], phoneNumber: [] });
  const [showSuggestions, setShowSuggestions] = useState({
    name: false,
    phoneNumber: false,
  });

  const [formData, setFormData] = useState({
    orderId: "",
    name: "",
    phoneNumber: "",
    products: [],
    category: [],
    units: [],
    garmentDetails: [],
    subUnits: [],
    address: "",
    location: "",
    dateOfOrder: "",
    dateOfDelivery: "",
    mode: "",
    paymentStatus: "",
    totalPrice: "",
    delivery: false,
    discount: "0",
  });

  const [error, setError] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Change the active tab based on user selection
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name" || name === "phoneNumber") {
      fetchSuggestions(value, name);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      name: suggestion.name,
      phoneNumber: suggestion.phoneNumber,
      address: suggestion.address,
    });

    setShowSuggestions({ name: false, phoneNumber: false });
  };

  const fetchSuggestions = async (query, field) => {
    if (query.length < 2) return;

    try {
      const response = await api.get(`api/orders/search`, {
        params: { query, field },
      });

      setSuggestions((prev) => ({ ...prev, [field]: response.data }));
      setShowSuggestions((prev) => ({ ...prev, [field]: true }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleProductChange = (e) => {
    if (selectedProduct.productName === e.label) return;
    setSelectedProduct({ ...selectedProduct, productName: e.label });
    const filteredgarment = garmentList.filter(
      (garment) => garment.categoryName === e.label
    );
    setSelectedGarments(filteredgarment[0]?.products);
    setSelectedSubProducts([]);
    setQuantities({});
  };

  const handleUnitsChange = (e) => {
    setSelectedProduct({ ...selectedProduct, units: e.target.value });
  };

  const saveCustomerDetails = async (orderId) => {
    try {
      await api.post(
        `api/customers/${orderId}`
      );
      // console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get(
        `api/route-location/all-locations`
      );
      setLocations(response.data); // Ensure `response.data` matches your API response structure
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const processAssign = async (orderId) => {
    try {
      const process = {
        process1: {
          userId: "null",
          status: "Pending",
          timing: null,
        },
        process2: {
          userId: "null",
          status: "Pending",
          timing: null,
        },
        process3: {
          userId: "null",
          status: "Pending",
          timing: null,
        },
        process4: {
          userId: "null",
          status: "Pending",
          timing: null,
        },
      };
       await api.post(
        `api/processes/order-process`,
        {
          orderId: orderId,
          currentProcess: "process0",
          process: process,
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all categories from backend
  const fetchCategories = async () => {
    try {
      const response = await api.get(`api/services/names`);
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };
  const fetchGarments = async () => {
    try {
      const response = await api.get(`api/garment/all`);
      setGarmentList(response.data);
    } catch (err) {
      setError("Failed to fetch Garments");
    }
  };

  // Fetch products based on selected category
  const fetchProducts = async (categoryId, categoryName) => {
    selectedProduct.productName = "";
    selectedProduct.units = "";
    try {
      const response = await api.get(
        `api/services/service_id/${categoryId}`
      );
      setProducts(response.data.products);
      setCategory({ categoryId: categoryId, categoryName: categoryName });
    } catch (err) {
      setError("Failed to fetch products");
    }
  };

  const removeProduct = (index) => {
    if (index < 0 || index >= selectedProducts.length) return;

    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    const updatedFormData = {
      ...formData,
      category: formData.category.filter((_, i) => i !== index),
      products: formData.products.filter((_, i) => i !== index),
      units: formData.units.filter((_, i) => i !== index),
      subUnits: formData.subUnits.filter((_, i) => i !== index),
      garmentDetails: formData.garmentDetails.filter((_, i) => i !== index),
    };

    const removedProduct = selectedProducts[index];
    const newTotalPrice = totalPrice - removedProduct.totalPrice;

    setSelectedProducts(updatedProducts);
    setFormData(updatedFormData);
    setTotalPrice(newTotalPrice);
  };

  // Add selected product to the list of selectedProducts
  const addProduct = () => {
    const product = products.find(
      (prod) => prod.productName === selectedProduct.productName
    );
    const pricePerUnit = product ? product.price : 0;
    const productTotalPrice = pricePerUnit * selectedProduct.units;

    const newProduct = {
      categoryId: category.categoryId,
      productName: selectedProduct.productName,
      units: selectedProduct.units,
      pricePerUnit,
      totalPrice: productTotalPrice,
    };

    formData.category.push(category.categoryName);
    formData.products.push(selectedProduct.productName);
    formData.units.push(selectedProduct.units);

    setSelectedProducts([...selectedProducts, newProduct]);
    setTotalPrice(totalPrice + productTotalPrice);
    // calculateMaxTAT();

    const selSubproDetails = selectedSubProducts.map((product) => {
      return product.label.props.children[0];
    });
    const selSubproQuantity = selectedSubProducts.map((product) => {
      return quantities[product.value] || 1;
    });

    formData.garmentDetails.push(selSubproDetails);
    formData.subUnits.push(selSubproQuantity);
    // console.log(formData);
    setSelectedSubProducts([]);
    setQuantities({});
    // Reset product and units input after adding

    setSelectedProduct({
      productName: "",
      units: "",
    });
  };

  const calculateMaxTAT = () => {
    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      console.error("Invalid selectedProducts array");
      return;
    }

    // console.log(selectedProducts);

    const tatValues = selectedProducts.map((prod) => {
      const selectedCategory = categories.find(
        (cat) => cat._id === prod.categoryId
      );
      if (!selectedCategory) {
        console.error("Category not found for product:", prod);
        return 0; // Or handle differently
      }
      const tat = selectedCategory.TAT;
      if (typeof tat !== "number" || isNaN(tat)) {
        console.error("Invalid TAT value for category:", selectedCategory);
        return 0; // Default TAT value
      }
      return tat;
    });

    // console.log("TAT Values:", tatValues);

    const newMaxTAT = Math.max(...tatValues);
    if (newMaxTAT === -Infinity || isNaN(newMaxTAT)) {
      console.error("Invalid maximum TAT value:", newMaxTAT);
      return; // Handle default case
    }

    const deliveryDate = new Date();
    if (newMaxTAT > 0) {
      deliveryDate.setDate(deliveryDate.getDate() + newMaxTAT); // Add TAT days
    } else {
      console.error("Invalid TAT, cannot calculate delivery date");
      return;
    }

    setFormData({
      ...formData,
      dateOfDelivery: deliveryDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`api/orders`);
      setOrders(response.data || []);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const createQrProcessUnits = async () => {
    let totalQrUnits = 0;
    for (let i = 0; i < Number(formData.units.length); i++) {
      if (Number(formData.subUnits[i].length) > 0) {
        totalQrUnits += formData.subUnits[i].reduce((acc, val) => acc + Number(val), 0);
      } else {
        totalQrUnits += Number(formData.units[i]);
      }
    }
   console.log(totalQrUnits);
    try {
      const response = await api.post(
        `api/qr-process/add/units`,
        {
          orderID: formData.orderId,
          units: totalQrUnits,
        }
      );
      if (response.data.success) {
        console.log("QR Process Units created successfully");
      } else {
        console.error("Failed to create QR Process Units");
      }
    } catch (error) {
      console.error("Error creating QR process units:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitionLoading(true);
    if (orders.length !== 0) {
      formData.orderId = generateNewOrderId(orders[0].orderId);
    } else {
      formData.orderId = generateNewOrderId("0");
    }
    formData.totalPrice = totalPrice - Number(formData.discount);

    // formData.garmentDetails = selSubproDetails;
    // formData.subUnits = selSubproQuantity;

    try {
      await api.post(`api/orders`, formData);

      setFormData({
        orderId: "",
        name: "",
        phoneNumber: "",
        products: [],
        category: [],
        units: [],
        garmentDetails: [],
        subUnits: [],
        address: "",
        location: "",
        dateOfOrder: "",
        dateOfDelivery: "",
        mode: "",
        paymentStatus: "",
        totalPrice: "",
        delivery: false,
        discount: "0",
      });

      fetchOrders();
      setSelectedProducts([]);
      setTotalPrice(0);
      createQrProcessUnits();
      setShowForm(false);
      saveCustomerDetails(formData.orderId);
      processAssign(formData.orderId);
      setError("");
    } catch (err) {
      setError("Failed to submit order");
    } finally {
      alert("Order Submitted Successfully");
      setSubmitionLoading(false);
    }
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    if (checked) {
      setTotalPrice(totalPrice + 50);
    } else {
      setTotalPrice(totalPrice - 50);
    }
  };

  const handleListChange = (selectedOptions) => {
    setSelectedSubProducts(selectedOptions || []);
  };

  const getPricePerUnits = () => {
    const product = products.find(
      (prod) => prod.productName === selectedProduct.productName
    );
    const pricePerUnit = product ? product.price : 0;
    return pricePerUnit;
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const CustomMultiValueRemove = (props) => {
    const { innerProps } = props;

    const handleRemove = (e) => {
      e.stopPropagation(); // Prevents dropdown toggle on remove
      innerProps.onClick(); // Call the original onClick function to remove the item
    };

    return (
      <components.MultiValueRemove {...props}>
        <span onClick={handleRemove} style={{ cursor: "pointer" }}>
          ✕
        </span>
      </components.MultiValueRemove>
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchOrders();
    fetchGarments();
    fetchLocations();
  }, []);
  useEffect(() => {
    calculateMaxTAT();
  }, [selectedProducts]);

  if (submitionLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Submitting...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {showForm ? "-" : "+"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded shadow-md"
        >
          <div className="grid grid-cols-3 gap-4">
            <Select
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.serviceName,
              }))}
              onChange={(e) => fetchProducts(e.value, e.label)}
              placeholder="Select Category"
              // required
            />

            <Select
              options={products.map((prod) => ({
                value: prod._id,
                label: prod.productName,
              }))}
              onChange={handleProductChange}
              value={
                selectedProduct.productName
                  ? {
                      label: selectedProduct.productName,
                      value: selectedProduct.productName,
                    }
                  : null
              }
              placeholder="Select Product"
              // required
            />

            {category.categoryName.split(" ").pop() === "Kilowise" && (
              <Select
                isMulti
                isSearchable
                options={
                  selectedGarments &&
                  selectedGarments.map((cat) => ({
                    value: cat._id,
                    labelText: cat.productName,
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {cat.productName}
                        {/* Input for the quantity of products */}
                        <input
                          type="number"
                          min="1"
                          style={{ width: "40px", marginLeft: "10px" }}
                          placeholder="Qty"
                          onChange={(e) => {
                            handleQuantityChange(cat._id, e.target.value);
                          }}
                        />
                      </div>
                    ),
                  }))
                }
                value={selectedSubProducts}
                onChange={handleListChange}
                placeholder="Select Products"
                components={{ MultiValueRemove: CustomMultiValueRemove }}
                formatOptionLabel={(option) => option.label} // Use custom label rendering
                getOptionLabel={(option) => option.labelText}
                styles={{
                  multiValue: (base) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "200px", // Adjust the width as needed
                    flexWrap: "wrap",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    padding: "5px",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "red",
                  }),
                }}
              />
            )}

            <input
              type="number"
              name="units"
              value={selectedProduct.units}
              placeholder="Units"
              onChange={handleUnitsChange}
              className="border p-2 rounded mb-2 w-full"
              min="1"
              // required
            />
          </div>
          <p className="mb-6">₹{getPricePerUnits()} Price / Unit</p>

          {selectedProduct.productName && selectedProduct.units && (
            <button
              type="button"
              onClick={addProduct}
              className="bg-green-500 text-white p-2 rounded mt-2 mb-4"
            >
              Add Product
            </button>
          )}

          {selectedProducts.length > 0 && (
            <div className="mt-4 mb-8">
              <h3 className="font-bold">Selected Products</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Category Name</th>
                    <th className="py-2 px-4">Product Name</th>
                    <th className="py-2 px-4">Units of Product</th>
                    <th className="py-2 px-4">Price / Unit</th>
                    <th className="py-2 px-4">Total Price</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((prod, index) => {
                    const category = categories.find(
                      (cat) => cat._id === prod.categoryId
                    );
                    // console.log(category);
                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          {category.serviceName}
                        </td>
                        <td className="border px-4 py-2">{prod.productName}</td>
                        <td className="border px-4 py-2">{prod.units}</td>
                        <td className="border px-4 py-2">
                          ₹{prod.pricePerUnit.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">
                          ₹{prod.totalPrice.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => removeProduct(index)} // Remove button functionality
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* <p className="font-bold mt-2">Total Price: ₹{totalPrice}</p> */}
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2 mb-1 mt-4">
              <label htmlFor="delivery" className="text-gray-700">
                Discount*
              </label>
            </div>
          )}
          {selectedProducts.length > 0 && (
            <input
              type="number"
              name="discount"
              placeholder="Discount"
              value={formData.discount}
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full"
              min="0"
            />
          )}
          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2 mb-2 mt-4">
              <input
                type="checkbox"
                id="delivery"
                name="delivery"
                checked={formData.delivery}
                // value={formData.delivery}
                onChange={handleToggleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring focus:ring-indigo-300"
              />
              <label htmlFor="delivery" className="text-gray-700">
                Pickup & Delivery ₹50*
              </label>
            </div>
          )}

          <input
            type="number"
            name="totalPrice"
            placeholder="Total Price"
            value={(totalPrice - Number(formData.discount)).toFixed(2)}
            className="border p-2 rounded mb-2 w-full"
            readOnly
          />
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full"
              required
            />
            {showSuggestions.name && suggestions.name.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow-md">
                {suggestions.name.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.name} - {suggestion.phoneNumber}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Phone Number"
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full"
              required
            />
            {showSuggestions.phoneNumber &&
              suggestions.phoneNumber.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow-md">
                  {suggestions.phoneNumber.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.name} - {suggestion.phoneNumber}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="Address"
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            required
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="dateOfOrder"
            value={formData.dateOfOrder}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <input
            type="date"
            name="dateOfDelivery"
            value={formData.dateOfDelivery}
            // onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            disabled
            required
          />

          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            required
          >
            <option disabled value="">
              Select Payment Mode
            </option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
            required
          >
            <option disabled value="">
              Select Payment Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded mt-4"
          >
            Submit
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
      <div className="mb-4">
        <button
          onClick={() => handleTabChange("printOrder")}
          className={`mr-4 p-2 ${
            activeTab === "printOrder"
              ? "bg-gray-700 text-white"
              : "bg-gray-300"
          }`}
        >
          Print Tag & Invoice
        </button>
        <button
          onClick={() => handleTabChange("close")}
          className={`p-2 ${
            activeTab === "close" ? "bg-gray-700 text-white" : "bg-gray-300"
          }`}
        >
          Close
        </button>
      </div>

      {activeTab === "printOrder" && <OrderTable />}

      {/* {activeTab === "tagGunPrint" && <PrintTags orders={orders} />} */}
      {/* </div> */}
    </div>
  );
};

export default OrderForm;
