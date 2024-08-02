import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSession, setAddPlan } from '../../Utils/localStorage';
import './Plans.css';
import { BackgroundImage, TopEllipse } from '../../Constant/imageConstant';

export const Plans = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plansData } = location.state || [];
  const [visibleDetails, setVisibleDetails] = useState({});
  const containerRef = useRef(null);

  const handleBuyClick = (plan) => {
    console.log(plan)
    setAddPlan(plan);
    navigate(-1);
  };

  const toggleDetails = (id) => {
    setVisibleDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateWidth = () => {
    if (containerRef.current) {
      const newWidth = containerRef.current.offsetWidth;
      // Update the CSS variable
    let  halfwidth=newWidth/2
      document.documentElement.style.setProperty('--container-width', `${halfwidth}px`);
    }
  };

  useEffect(() => {
    updateWidth();

    // Update width on window resize
    window.addEventListener('resize', updateWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className="HomeContainer">
    <img src={BackgroundImage} className='mainbackground'  />
  
      <div className='FormContainer'>
     
        <div className="frontbanner">
        <img src={TopEllipse} alt="RSA Banner" style={{width:'100%',}}  />
        <img
            src={"https://www.tvsservice.com/assets/images/tvs.png"}
            alt="tvs-brand-logo"
            className="HeaderLogo"
            
          />
          </div>
         
        <div className='FormHeader'>
          <p style={{ fontSize: '24px' }}>
            Road Side Assistance (RSA)
          </p>
        </div>
    {/* <div className="plans-container"> */}
      {plansData.map((plan) => (
        <div  
  ref={containerRef}

  className='planContainer'>
           <div className='plan-header'>
      <div className='planheaderpart1'>
        <p className='plantitle'>


      {plan.plan_name}

        </p>
      </div>
      <div className='planheaderpart2'>
      <p onClick={()=>handleBuyClick(plan)} className='planamount'><span style={{fontSize:'16px',fontWeight:'bold'}}>Buy@ ₹{parseFloat(plan.plan_amount) + parseFloat(plan.gst_amount)}/year</span></p>
        <div className='planHeaderpart2triangle'></div>
        <div className='planHeaderpart2triangle2'></div>
        <div className='planHeaderpart2triangle3'></div>


      </div>
      

    </div>
      
           <div className="plan-info">

          
          
          
              {true && (
            <div className="plan-details">
              
              <p className='planinfocontent'>Plan Code:<strong> {plan.plan_code}</strong></p>
              <p className='planinfocontent'>KM Covered:<strong> {plan.km_covered} km</strong></p>
              <p className='planinfocontent'>Sum Insured:<strong> ₹{plan.sum_insured}</strong></p>
              <p className='planinfocontent'>Tenure:<strong> {plan.rsa_tenure} year(s)</strong></p>
            </div>
          )}
         
          </div>
        </div>
      ))} 
   

    </div>

    </div>
  );
};
