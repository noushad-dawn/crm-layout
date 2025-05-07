import React from "react";
import CurrentStatus from "./sub/CurrentStatus";
import TatTable from "./sub/TatTable";
import ErrorBoundary from "../errorBoundry/errorBoundry";

function ProcessRoute() {
  return (
    <ErrorBoundary>
      <TatTable />
      {/* <CurrentStatus /> */}
    </ErrorBoundary>
  );
}

export default ProcessRoute;
