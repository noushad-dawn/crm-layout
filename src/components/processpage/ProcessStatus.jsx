import React from 'react'
import JourneyOfOrderTable from './JourneyOfOrder';
import InventoryManagement from '../directories2/InventoryMngmt';
import DateFilterTable from '../DateFilterTable2';
import CrateTable from './CrateTable';
import TatTable from './TatTable';
import CurrentStatus from './CurrentStatus';


const ProcessStatus = () => {
  return (
  <>
   <CrateTable/>
   <CurrentStatus/>
   <InventoryManagement/>
   <DateFilterTable/>
   <JourneyOfOrderTable/>
   <TatTable/>
   </>
  )
}

export default ProcessStatus;