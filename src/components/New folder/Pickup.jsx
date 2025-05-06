import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const PickupForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    location: "",
    route: "",
    driverId: "",
    pickupDate: "",
    timeslot: "",
    status: "Ready to be Picked",
  });
  const [drivers, setDrivers] = useState([]);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [pickups, setPickups] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState();
  const [locations, setLocations] = useState([]);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/route-location/routes`
      );
      setRoutesData(response.data || []);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const sendPickUpMessage = () => {
    const licenseNumber = import.meta.env.VITE_WHATSAPP_LICENSE_NUMBER;
    const apiKey = import.meta.env.VITE_WHATSAPP_API_KEY;
    const driver = drivers.find((driver) => driver._id === formData.driverId);
    const contact = driver.phoneNumber.trim();
    const template = "pickup_details";
    const name = driver.name.trim();
    const url = `https://app.chatbroadcast.net/api/sendtemplate.php?LicenseNumber=${encodeURIComponent(
      licenseNumber
    )}&APIKey=${encodeURIComponent(apiKey)}&Contact=${encodeURIComponent(
      contact
    )}&Template=${encodeURIComponent(template)}&Param=${encodeURIComponent(
      driver?.name
    )},${encodeURIComponent(formData.customerName)},${encodeURIComponent(
      formData.phoneNumber
    )},${encodeURIComponent(
      formData.address.replaceAll(",", ";").trim()
    )},${encodeURIComponent(
      formData.location.replaceAll(",", ";").trim()
    )},${encodeURIComponent(formData.route)},${encodeURIComponent(
      formData.timeslot
    )}&Name=${encodeURIComponent(name)}`;
    axios
      .get(url)
      .then((response) => {
        console.log("Response:", response.data);
        alert("Message has been sent");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong");
      });
  };

  const findRouteByLocation = (locationName) => {
    const route = routesData.find((route) => {
      return route.locations.some(
        (location) => location.name.toLowerCase() === locationName.toLowerCase()
      );
    });

    return route ? route.routeName : "No route found";
  };

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/api/drivers`);
        setDrivers(response.data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Fetch pickups
  const fetchPickups = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/pickups`);
      console.log(response.data);
      setPickups(response.data);
    } catch (error) {
      console.error("Failed to fetch pickups:", error);
    }
  };

  useEffect(() => {
    fetchPickups();
    fetchRoutes();
    fetchLocations();
  }, []);

  // Handle form input changes

  const handleChangeSlot = (e) => {
    const { name, value } = e.target;
    setSelectedSlot(value);
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/route-location/all-locations`
      );
      setLocations(response.data); // Ensure `response.data` matches your API response structure
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // If the location is updated, calculate the route
      if (name === "location") {
        updatedData.route = findRouteByLocation(value);
      }

      return updatedData;
    });
  };

  // Submit pickup details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.baseURL}/api/pickups`,
        formData
      );
      alert("Pickup submitted successfully!");
      setPickups([...pickups, response.data]);
      sendPickUpMessage();
      setFormData({
        customerName: "",
        phoneNumber: "",
        address: "",
        location: "",
        route: "",
        driverId: "",
        pickupDate: "",
        timeslot: "",
      });
    } catch (error) {
      console.error("Failed to submit pickup:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Pickup Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
            {locations?.map?.((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            )) || <option disabled>No locations available</option>}
          </select>
          <input
            type="text"
            name="route"
            placeholder="Route"
            value={formData.route}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            readOnly
            required
          />

          {/* Added pickupDate input */}
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />

          <select
            name="timeslot"
            value={formData.timeslot}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="" disabled>
              Select Timeslot
            </option>
            <option value="9AM - 12PM">9AM - 12PM</option>
            <option value="12PM - 3PM">12PM - 3PM</option>
            <option value="3PM - 6PM">3PM - 6PM</option>
            <option value="6PM - 9PM">6PM - 9PM</option>
          </select>

          <button
            type="button"
            onClick={() => setShowDriverPopup(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Choose Driver
          </button>
          <p>
            Driver:{" "}
            {drivers?.find?.((driver) => driver._id === formData.driverId)
              ?.name || "No drivers available"}
          </p>

          {showDriverPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Select Driver
                </h2>
                <ul className="space-y-2">
                  {drivers.map((driver) => (
                    <li
                      key={driver._id}
                      className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-blue-100"
                      onClick={() => {
                        setFormData({ ...formData, driverId: driver._id });
                        setShowDriverPopup(false);
                      }}
                    >
                      {driver.name}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowDriverPopup(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Today's Pickups
        </h2>
        <select
          name="ts"
          value={selectedSlot}
          onChange={handleChangeSlot}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          required
        >
          <option value="">Select Timeslot</option>
          <option value="9AM - 12PM">9AM - 12PM</option>
          <option value="12PM - 3PM">12PM - 3PM</option>
          <option value="3PM - 6PM">3PM - 6PM</option>
          <option value="6PM - 9PM">6PM - 9PM</option>
        </select>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Customer Name</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Driver</th>
                <th className="py-2 px-4 border">Route</th>
                <th className="py-2 px-4 border">Time Slot</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {pickups
                ?.filter?.((pickup) => {
                  const pickupDate =
                    pickup?.date &&
                    new Date(pickup.date).toISOString().split("T")[0];
                  const todayDate = new Date().toISOString().split("T")[0];
                  return (
                    pickupDate === todayDate && pickup.timeslot === selectedSlot
                  );
                })
                ?.map((pickup) => (
                  <tr key={pickup._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{pickup.customerName}</td>
                    <td className="py-2 px-4 border">{pickup.phoneNumber}</td>
                    <td className="py-2 px-4 border">{pickup.address}</td>
                    <td className="py-2 px-4 border">{pickup.location}</td>
                    <td className="py-2 px-4 border">
                      {pickup.driverId?.name}
                    </td>
                    <td className="py-2 px-4 border">{pickup.route}</td>
                    <td className="py-2 px-4 border">{pickup.timeslot}</td>
                    <td className="py-2 px-4 border">{pickup.status}</td>
                  </tr>
                )) || (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No pickups found for this slot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PickupForm;
