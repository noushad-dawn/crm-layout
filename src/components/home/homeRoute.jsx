import React from "react";
import Dashboard from "./sub/Dashboard";
import CategoryChart from "./sub/CategoryChart";
import DashboardHeader from "./sub/DashboardHeader";
import JourneyOfOrderTable from "./sub/JourneyOfOrder";

function HomeRoute() {
  return (
    <div className="App">
      <JourneyOfOrderTable />
      <DashboardHeader />
      <Dashboard />
      <CategoryChart />
    </div>
  );
}

export default HomeRoute;
