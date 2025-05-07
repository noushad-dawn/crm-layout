import React from 'react';
import InventoryManagement from './sub/InventoryMngmt';
import CrateTable from './sub/CrateTable';

function DashboardRoute() {
  return (
    <div className="App">
     <InventoryManagement/>
     <CrateTable/>
    </div>
  );
}

export default DashboardRoute;
