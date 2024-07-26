import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSession, setAddPlan } from '../../Utils/localStorage';
import './Plans.css';

export const Plans = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plansData } = location.state || [];
  const [visibleDetails, setVisibleDetails] = useState({});

  const handleBuyClick = (plan) => {
    console.log(plan)
    setAddPlan(plan);
    navigate(-1);
  };

  const toggleDetails = (id) => {
    setVisibleDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="plans-container">
      {plansData.map((plan) => (
        <div key={plan.id} className="plan-item">

          <div className="plan-info">

            <h3 style={{color:'#a6a9ae',fontWeight:'700',textAlign:'center',margin:'15px'}}>
              {plan.plan_name}
            </h3>
            <p style={{color:'#0089D2',fontSize:'24px',fontWeight:'bold',textAlign:'center',width:'250px',margin:'15px'}}>
              ₹ {parseFloat(plan.plan_amount) + parseFloat(plan.gst_amount)}/<span style={{fontSize:'16px',fontWeight:'bold'}}>year</span>
            </p>
            <div className="details-toggle" onClick={() => toggleDetails(plan.id)}>
              <span>{visibleDetails[plan.id] ? 'Hide Package Details ▲' : 'Show Package Details ▼'}</span>
              <div style={{textAlign:'left',marginTop:'15px'}}>
              {visibleDetails[plan.id] && (
            <div className="plan-details">
              <p><strong>Plan Code:</strong> {plan.plan_code}</p>
              <p><strong>KM Covered:</strong> {plan.km_covered} km</p>
              {/* <p><strong>Commission:</strong> Dealer - ₹{plan.dealer_commission}, RSA - ₹{plan.rsa_commission_amount}</p> */}
              <p><strong>Sum Insured:</strong> ₹{plan.sum_insured}</p>
              <p><strong>Tenure:</strong> {plan.rsa_tenure} year(s)</p>
              {/* Add any other details you want to show here */}
            </div>
          )}
          </div>
            </div>
          </div>
         
          <button className="buy-button" onClick={() => handleBuyClick(plan)}>Buy Plan</button>
        </div>
      ))}
    </div>
  );
};
