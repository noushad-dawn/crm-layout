import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Components
import ClientLoginPage from "./components/authentication/ClientLoginPage";
import LoginPage from "./components/authentication/LoginPage";
import SideNavbar from "./sidenavbar/SideNavbar";
import InventoryManagement from "./components/directories2/InventoryMngmt";
import HomePage from "./components/firstpage/HomePage";
import DashboardRoute from "./components/dashboard/DashboardRoute";
import ProcessStatus from "./components/processpage/ProcessStatus";
import OrderForm from "./components/firstpage/OrderForm";
import Receipt from "./components/New folder/Receipt2";
import CustomerDirectory from "./components/New folder/CustomerDirectory2";
import DriverTrackingPage from "./components/directories2/DriverTrackingPage";
import OrderDirectory from "./components/directories2/OrderDirectory2";
import UserOrderDirectory from "./components/directories2/UserOrderDirectory";
import PickupDirectory from "./components/New folder/PickupDirectory";
import IronUnitDirectory from "./components/directories2/IronUnitDirectory";
import ProductCount from "./components/directories2/ProductCount";
import PaymentTable from "./components/PaymentTable";
import PrintTag from "./components/New folder/PrintTag";
import PickupPage from "./components/pickup/pickup";
import OrderPage from "./components/order/order";
import DriverStatus from "./components/firstpage/DriverStatus";
import CrateTable from "./components/processpage/CrateTable"; 
import CT from "./components/process status CT/processStatus";
import AssignTable from "./components/firstpage/OtbD";

function App() {
  const isClientValidated = () => {
    return localStorage.getItem("clientValidated") === "true";
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime ? decoded : false;
    } catch {
      return false;
    }
  };

  const ClientProtectedRoute = ({ children }) => {
    return isClientValidated() ? (
      children
    ) : (
      <Navigate to="/client-login" replace />
    );
  };

  const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const user = isAuthenticated();
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  const DashboardLayout = () => (
    <div className="flex">
      <SideNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );

  return (
    <Routes>
     
      <Route path="/client-login" element={<ClientLoginPage />} />

     <Route
        path="/login"
        element={
          // <ClientProtectedRoute>
            <LoginPage />
          // </ClientProtectedRoute>
        }
      />

     <Route
        path="/print-tag/:orderId"
        element={
          // <ClientProtectedRoute>
          //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PrintTag />
          //   </RoleProtectedRoute>
          // </ClientProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          // <ClientProtectedRoute>
            // <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
              <DashboardLayout />
              // <SideNavbar />
            //  </RoleProtectedRoute>
          // </ClientProtectedRoute> 
        }
      >
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route
          path="dashboard"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <DashboardRoute />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="process-status"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <ProcessStatus />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="order-form"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderForm />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="receipt/:orderId"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <Receipt />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="customer-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <CustomerDirectory />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="driver-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <DriverTrackingPage />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="order-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderDirectory />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="user-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <UserOrderDirectory />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="pickup-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
              <PickupDirectory />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="iron_unit-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <IronUnitDirectory />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="qr-process-directory"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <ProductCount />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="payment-table"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PaymentTable />
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="pickup"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PickupPage/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="order"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderPage/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="driver/ready"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
            <AssignTable/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="driver/status"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
            <DriverStatus/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="/process-status/CrateTable"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <CrateTable/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="process-status/InventoryManagement"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <InventoryManagement/>
            // </RoleProtectedRoute>
          }
        />
        <Route
          path="CT"
          element={
            // <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <CT/>
            // </RoleProtectedRoute>
          }
        />
      </Route>

      <Route path="#" element={<Navigate to="/client-login" replace />} />
    </Routes>
  );
}

export default App;




// import React from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// // Components
// import ClientLoginPage from "./components/authentication/ClientLoginPage";
// import LoginPage from "./components/authentication/LoginPage";
// import SideNavbar from "./sidenavbar/SideNavbar";

// import HomePage from "./components/firstpage/HomePage";
// import DashboardRoute from "./components/dashboard/DashboardRoute";
// import ProcessStatus from "./components/processpage/ProcessStatus";
// import OrderForm from "./components/firstpage/OrderForm";
// import Receipt from "./components/New folder/Receipt2";
// import CustomerDirectory from "./components/New folder/CustomerDirectory2";
// import DriverTrackingPage from "./components/directories2/DriverTrackingPage";
// import OrderDirectory from "./components/directories2/OrderDirectory2";
// import UserOrderDirectory from "./components/directories2/UserOrderDirectory";
// import PickupDirectory from "./components/New folder/PickupDirectory";
// import IronUnitDirectory from "./components/directories2/IronUnitDirectory";
// import ProductCount from "./components/directories2/ProductCount";
// import PaymentTable from "./components/PaymentTable";
// import PrintTag from "./components/New folder/PrintTag";

// function App() {
//   const location = useLocation();
//   const pathname = location.pathname;

//   const isLoginPage = true;
//   // const isLoginPage = pathname === "/client-login" || pathname === "/login";

//   const isClientValidated = () => {
//     return localStorage.getItem("clientValidated") === "true";
//   };

//   const isAuthenticated = () => {
//     const token = localStorage.getItem("authToken");
//     if (!token) return false;
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Math.floor(Date.now() / 1000);
//       return decoded.exp > currentTime ? decoded : false;
//     } catch {
//       return false;
//     }
//   };

//   const ClientProtectedRoute = ({ children }) => {
//     return isClientValidated() ? children : <Navigate to="/client-login" replace />;
//   };

//   const RoleProtectedRoute = ({ children, allowedRoles }) => {
//     const user = isAuthenticated();
//     if (!user) return <Navigate to="/login" replace />;
//     if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
//     return children;
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {!isLoginPage && <SideNavbar />}

//       <div className={isLoginPage ? "flex-1 overflow-auto" : "flex-1 overflow-auto pl-64"}>
//         <div>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/client-login" element={<ClientLoginPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route
//               path="/print-tag/:orderId"
//               element={<PrintTag />}
//             />

//             {/* Protected Routes */}
//             <Route
//               path="/"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
//                     <HomePage />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/home"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
//                     <HomePage />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <DashboardRoute />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/process-status"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <ProcessStatus />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/order-form"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <OrderForm />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/receipt/:orderId"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <Receipt />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/customer-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <CustomerDirectory />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/driver-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <DriverTrackingPage />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/order-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <OrderDirectory />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/user-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <UserOrderDirectory />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/pickup-directory"
//               element={
//                 // <ClientProtectedRoute>
//                  // <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
//                     <PickupDirectory />
//                  // </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/iron_unit-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <IronUnitDirectory />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/qr-process-directory"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <ProductCount />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />
//             <Route
//               path="/payment-table"
//               element={
//                 // <ClientProtectedRoute>
//                 //   <RoleProtectedRoute allowedRoles={["user", "admin"]}>
//                     <PaymentTable />
//                 //   </RoleProtectedRoute>
//                 // </ClientProtectedRoute>
//               }
//             />

//             {/* Catch All */}
//             <Route path="*" element={<Navigate to="/client-login" replace />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;