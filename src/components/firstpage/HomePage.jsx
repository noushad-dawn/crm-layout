import React from "react";
// import DriverStatus from '../New folder/DriverStatus';
import DriverStatus from "./DriverStatus";
import OtbD from "./OtbD";
import PickupDetail from "../New folder/Pickup";
import PickupDirectory from "../New folder/PickupDirectory";
import ErrorBoundary from "../errorBoundry";

const HomePage = () => {
  return (
    <>
      <OtbD />
      <DriverStatus />
      <PickupDetail />
      <ErrorBoundary>
        <PickupDirectory />
      </ErrorBoundary>
      {/* <CurrentStatus/> */}
    </>
  );
};

export default HomePage;
