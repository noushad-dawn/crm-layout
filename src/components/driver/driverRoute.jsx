import React from 'react';
import AssignTable from './sub/OtbD';
import DriverStatus from './sub/DriverStatus';

function DriverRoute() {
  return (
    <div className="App">
      <AssignTable/>
      <DriverStatus/>
    </div>
  );
}

export default DriverRoute;
