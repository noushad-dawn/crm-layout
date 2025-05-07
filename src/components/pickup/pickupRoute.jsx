import React from "react";
import PickupForm from "./sub/Pickup";
import ErrorBoundary from "../errorBoundry/errorBoundry";
import PickupDirectory from "./sub/PickupDirectory";

const PickupPage = () => {
  return (
    <ErrorBoundary>
      <PickupForm />
      <PickupDirectory/>
    </ErrorBoundary>
  );
};

export default PickupPage;
