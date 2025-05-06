import React from 'react';
import Dashboard from './Dashboard';
import CategoryChart from './CategoryChart';
import DashboardHeader from './DashboardHeader';
import JourneyOfOrderTable from '../processpage/JourneyOfOrder';


function DashboardRoute() {
  return (
    <div className="App">
     <JourneyOfOrderTable/>
      <DashboardHeader/>
     <Dashboard/>
     <CategoryChart/> 
    </div>
  );
}

export default DashboardRoute;
