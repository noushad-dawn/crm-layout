import React from "react";
import CustomerDirectory from "./sub/CustomerDirectory";
import DriverTrackingPage from "./sub/DriverTrackingPage";
import OrderDirectory from "./sub/OrderDirectory";
import UserOrderDirectory from "./sub/UserOrderDirectory";
import PickupDirectory from "./sub/PickupDirectory";
import ProductCount from "./sub/ProductCount";
import IronUnitDetails from "./sub/IronUnitDirectory";
import ErrorBoundary from "../errorBoundry/errorBoundry";

function DirectoriesRoute() {
  return (
    <ErrorBoundary>
      <CustomerDirectory />
      <OrderDirectory />
      <DriverTrackingPage />
      <UserOrderDirectory />
      <PickupDirectory />
      <IronUnitDetails />
      <ProductCount />
    </ErrorBoundary>
  );
}

export default DirectoriesRoute;
