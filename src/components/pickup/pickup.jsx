import React from "react";
import PickupForm from "../New folder/Pickup";
import ErrorBoundary from "../errorBoundry";
import PickupDirectory from "../New folder/PickupDirectory";

const PickupPage = () => {
  return (
    <ErrorBoundary>
      <PickupForm />
      <PickupDirectory/>
    </ErrorBoundary>
  );
};

export default PickupPage;
