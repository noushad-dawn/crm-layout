import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiPackage,
  FiUser,
  FiBox,
  FiClock,
  FiFolder,
  FiDollarSign,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { GiWashingMachine } from "react-icons/gi";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

  const navItems = [
    { 
      name: 'Home', 
      icon: <FiHome className="text-lg" />, 
      path: '/dashboard',
    },
    { 
      name: 'Pick-up', 
      icon: <FiTruck className="text-lg" />,
      path: '/pickup',
    },
    { 
      name: 'Order', 
      icon: <FiPackage className="text-lg" />,
      path: '/order',
    },
    { 
      name: 'Driver', 
      icon: <FiUser className="text-lg" />,
      submenu: [
        { name: 'Ready to Deliver', path: '/driver/ready' },
        { name: 'Driver Status', path: '/driver/status' }
      ]
    },
    { 
      name: 'Inventory', 
      icon: <FiBox className="text-lg" />,
      submenu: [
        { name: 'Inventory Management', path: '/process-status/InventoryManagement' },
        { name: 'Crates of Orders', path: '/process-status/CrateTable' }
      ]
    },
    { 
      name: 'Process', 
      icon: <FiClock className="text-lg" />,
      path: '/ct',
    },
    {
      name: "Directories",
      icon: <FiFolder className="text-lg" />,
      path: "/directories",
      submenu: [
        { name: "Customer Directory", path: "/customer-directory" },
        { name: "Order Directory", path: "/order-directory" },
        { name: "Driver Directory", path: "/driver-directory" },
        { name: "User Directory", path: "/user-directory" },
        { name: "Pick-Up Directory", path: "/pickup-directory" },
        { name: "Iron Unit Directory", path: "/iron_unit-directory" },
        { name: "Qr Process Directory", path: "/qr-Process-directory" },
      ],
    },
    {
      name: "Payment",
      icon: <FiDollarSign className="text-lg" />,
      submenu: [
        { name: "Payment Table", path: "/payment-table" },
        { name: "Expenses", path: "/payment/expenses" },
      ],
    },
  ];

  return (
    <div
      className={`flex h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div
        className={`fixed h-full bg-white shadow-lg z-20 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center">
              <GiWashingMachine className="text-3xl mr-3 text-blue-400" />
              <span className="text-xl font-semibold text-gray-800">
                Prime Laundry
              </span>
            </div>
          ) : (
            <span className="text-xl font-semibold text-gray-800">PL</span>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {navItems.map((item, index) => (
            <div key={index}>
              {!item.submenu ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`
                  }
                >
                  <span className={`${isOpen ? "mr-3" : "mx-auto"}`}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 ${
                      activeSubmenu === item.name
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${isOpen ? "mr-3" : "mx-auto"}`}>
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>
                    {isOpen && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSubmenu === item.name
                            ? "transform rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {isOpen && activeSubmenu === item.name && (
                    <div className="pl-8 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer with Logout Button */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800`}
          >
            <span className={`${isOpen ? "mr-3" : "mx-auto"}`}>
              <FiLogOut className="text-lg" />
            </span>
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
