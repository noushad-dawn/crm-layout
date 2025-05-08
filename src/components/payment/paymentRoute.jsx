import React from 'react';
import PaymentTable from './sub/PaymentTable';
import Receipt from './sub/Receipt2';

function PaymentRoute() {
  return (
    <div className="App">
      <PaymentTable/>
      <Receipt/>
    </div>
  );
}

export default PaymentRoute;
