import React from 'react'
import CurrentStatus from '../processpage/CurrentStatus'
import TatTable from '../processpage/TatTable'
import ErrorBoundary from '../errorBoundry'

function CT() {
  return (
    <div>
      <ErrorBoundary>
        {/* <CurrentStatus/> */}
        <TatTable/>
        </ErrorBoundary>
    </div>
  )
}

export default CT