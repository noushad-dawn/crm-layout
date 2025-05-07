import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ClientLoginPage from "./components/authentication/ClientLoginPage";
import LoginPage from "./components/authentication/LoginPage";
import SideNavbar from "./components/sidenavbar/SideNavbar";
import HomeRoute from "./components/home/homeRoute";
import PickupRoute from "./components/pickup/pickupRoute";
import OrderRoute from "./components/order/orderRoute";
import DriverStatus from "./components/driver/sub/DriverStatus";
import AssignTable from "./components/driver/sub/OtbD";
import InventoryManagement from "./components/inventory/sub/InventoryMngmt";
import CreateTable from "./components/inventory/sub/CrateTable";
import ProcessRoute from "./components/process/ProcessRoute";
import CustomerDirectory from "./components/directories/sub/CustomerDirectory";
import DriverTrackingPage from "./components/directories/sub/DriverTrackingPage";
import IronUnitDirectory from "./components/directories/sub/IronUnitDirectory";
import OrderDirectory from "./components/directories/sub/OrderDirectory";
import PickupDirectory from "./components/directories/sub/PickupDirectory";
import ProductCount from "./components/directories/sub/ProductCount";
import UserOrderDirectory from "./components/directories/sub/UserOrderDirectory";
import PaymentTable from "./components/payment/sub/PaymentTable";
import Receipt from "./components/Extra/Receipt2";
import PrintTag from "./components/Extra/PrintTag";

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

  const AuthProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
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
      {/* Public routes */}
      <Route path="/client-login" element={<ClientLoginPage />} />

      {/* Client-protected routes */}
      <Route
        path="/login"
        element={
          <ClientProtectedRoute>
            <LoginPage />
          </ClientProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Fully protected routes (require both client validation and auth) */}
      <Route
        element={
          <ClientProtectedRoute>
            <AuthProtectedRoute>
              <DashboardLayout />
            </AuthProtectedRoute>
          </ClientProtectedRoute>
        }
      >
        <Route index element={<HomeRoute />} />
        <Route path="home" element={<HomeRoute />} />

        <Route
          path="dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <HomeRoute />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="pickup"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PickupRoute />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="order"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderRoute />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="driver/ready"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <AssignTable />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="driver/status"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <DriverStatus />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="inventorymanagement"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <InventoryManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="inventorymanagement/cratetable"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <CreateTable />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="process"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <ProcessRoute />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="customer-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <CustomerDirectory />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="driver-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <DriverTrackingPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="user-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <UserOrderDirectory />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="pickup-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin", "driver"]}>
              <PickupDirectory />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="iron_unit-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <IronUnitDirectory />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="qr-process-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <ProductCount />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="payment-table"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PaymentTable />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="receipt/:orderId"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <Receipt />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="order-directory"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderDirectory />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Print tag route with separate protection */}
      <Route
        path="/print-tag/:orderId"
        element={
          <ClientProtectedRoute>
            <RoleProtectedRoute allowedRoles={["user", "admin"]}>
              <PrintTag />
            </RoleProtectedRoute>
          </ClientProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/client-login" replace />} />
    </Routes>
  );
}

export default App;
