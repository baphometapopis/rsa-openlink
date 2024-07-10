import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSession, setAddPlan } from '../../Utils/localStorage';
import './Plans.css';

export const Plans = () => {
  const location = useLocation();
  const navigate= useNavigate()
  const { plansData } = location.state || [];

  const handleBuyClick = (plan) => {

    setAddPlan(plan)
    navigate(-1)

    


    
  };

  return (
    <div className="plans-container">
      {plansData.map((plan) => (
        <div key={plan.id} className="plan-item">
          <div className="plan-info">
            <h3 style={{color:'#a6a9ae',fontWeight:'700',width:'250px',textAlign:'center',margin:'15px'}}>
              {plan.plan_name}
            </h3>
            <p style={{color:'#0089D2',fontSize:'24px',fontWeight:'bold',textAlign:'center',width:'250px',margin:'15px'}}>
              ₹ {plan.plan_amount + plan.gst_amount}/<span style={{fontSize:'16px',fontWeight:'bold'}}>year</span>
            </p>
          </div>
          <button className="buy-button" onClick={() => handleBuyClick(plan)}>Buy Plan</button>
        </div>
      ))}
    </div>
  );
};
