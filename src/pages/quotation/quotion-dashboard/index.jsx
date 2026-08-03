import React from 'react'
import NewEstimate from '../components/NewEstimate'
import EstimateItems from '../components/Estimate-items'
import PaymentDetails from '../components/PaymentDetails'

const QuotationDashboard = () => {
  return (
    <div className="min-h-screen p-6">
      <NewEstimate/>
      <EstimateItems/>
      <PaymentDetails/>
    </div>
  )
}

export default QuotationDashboard
