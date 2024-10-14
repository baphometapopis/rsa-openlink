import React, { useEffect, useRef, useState } from 'react';
import { BackgroundImage, IconSearch, PhoneNumberEdit, RsaBanner } from '../../Constant/imageConstant';
import { Api_Endpoints } from '../../Services/Api/apiEndpoint';
import { makeApiCall } from '../../Services/Api/makeApiCall';
import { showErrorToast, showSuccessToast } from '../../Services/ToastServices/toastService';
import { clearUserSession, getOTP, getParamsFromLocal, getUserSession, removeOTP, setFormDatatoLocal, setOTP, setParamsToLocal, updateMobileNotoLocal } from '../../Utils/localStorage';
import VerifyHuman from '../VerifyHuman/VerifyHuman';
import './HomePage.css';
import '../../COLOR.css' // Import the CSS file
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FullPageLoader from '../../Components/FullPageLoader/FullPageLoader';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Footer } from '../../Components/Footer/Footer';
import { decryptPassword } from '../../Utils/encryption';

const HomePage = () => {
  const { service, dealer_id } = useParams();
  

  const [isOtpValid, setIsOtpValid] = useState(false);
  const [ShowMobileOTP,setShowMobileOTP]=useState(false)

  const [successPolicyData,setsuccessPolicyData]=useState(null)
  const [policyPDF,setpolicyPDF]=useState(null)

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [chassisNumber, setChassisNumber] = useState('');
const [showLoader,setShowLoader] = useState(false)

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(300);
  const [showCaptcha,setShowcaptcha]=useState(false)
  const [paymentMessage,setPaymentMessage]=useState('')

  const [engineNumber, setEngineNumber] = useState('');
  const [policyData, setPolicyData] = useState('');
  const [error, setError] = useState('');
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const inputRefs = useRef([]);
  const [isChassisVerified, setIsChassisVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const location = useLocation()

  const [paymentstatus,setPaymentStatus]=useState(false)
  const [showSearchBar,setshowSearchBar]=useState(true)

  const [showpaymentstatus,setShowPaymentStatus]=useState(false)


const sendOtp =async()=>{
setShowLoader(true)
  let res = await makeApiCall(Api_Endpoints.sendOTP,'GET',{mobile_number:phoneNumber})

  if(res?.status){
    res.data= decryptPassword(res?.data)
    showSuccessToast(res?.message)
    setOTP(res.data)
  }else{
    showErrorToast(res?.message)
  }
  setShowLoader(false)

}
  
  const validateEngineNumber = (value) => {
    const pattern = /^[A-Za-z0-9]{5,17}$/;
    if (!pattern.test(value)) {
      setError('Invalid engine number. It should be 5-17 alphanumeric characters and no special characters.');
    } else {
      setError('');
    }
  };
  const handleCaptchaVerify = () => {
    if (validateCaptcha(captchaInput)) {
      setIsCaptchaVerified(true);
      sendOtp() 
      setTimer(300)
      setShowMobileOTP(true)
    } else {
      setCaptchaInput('')
      alert('Captcha validation failed. Please try again.');
    }
  };


  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase();
    // Remove any characters that are not alphanumeric
    value = value.replace(/[^A-Z0-9]/g, '');
    if (value.length <= 17) {
      setEngineNumber(value);
      validateEngineNumber(value);
    }
  };
  

  const searchEngineNumber = () => {
    if (engineNumber) {
      setShowPaymentStatus(false)
      setCaptchaInput('');
      setPhoneNumber(null)
      setShowVerificationBox(false);
      setShowcaptcha(false)
      getVehicleDetails();


    } else {
      showErrorToast('Please enter Engine No');
    }
  };

  const getVehicleDetails = async () => {
    setShowLoader(true)

    try {
      let  res = await makeApiCall(Api_Endpoints.getDataByChassisNumber, 'POST', {
        vehicle_detail: engineNumber,
      });
      if (res?.status) {
      res.model_array =  decryptPassword(res.model_array)
      res.policy_data =  decryptPassword(res.policy_data)
        setPolicyData(res);
        setFormDatatoLocal(res);
        showSuccessToast('Engine Number Found');
        setShowVerificationBox(true);
        setPhoneNumber(res?.policy_data?.mobile_no)
        if(res?.policy_data?.mobile_no===''){
          showErrorToast('Mobile number not Found Please Update.')
        }
      setShowcaptcha(true)
      setIsOtpSent(true)

      } else {
        showErrorToast(res?.message);
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching vehicle details.');
    }
    setShowLoader(false)
  };
  const handleOtpChange = (index, value) => {
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otp = otpInputs.join('');
  let data = getOTP()
    if (otp === data) { // Replace '123456' with actual OTP verification logic
      setIsOtpValid(true);

      showSuccessToast('OTP VERIFIED')
      navigate('/Generate-Policy',{state:policyData,service:service,dealer_id:dealer_id})
      removeOTP()
    } else {
      alert('Invalid OTP');
      setOtpInputs(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };
  const resendOtp = () => {

    setTimer(300);
    setOtpInputs(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
    sendOtp()
    // showSuccessToast('Otp Sent')
    
  };
  const handleChassisSubmit = async () => {
    // Add your API call or validation logic here

    if(chassisNumber===policyData?.policy_data?.chassis_no){
      setIsChassisVerified(true)
      setChassisNumber('')
      // setNewMobileNumber(null)
    }else{
      showErrorToast('Chassis Not matched')
    }
  
  };
  const maskedPhoneNumber = phoneNumber?.slice(0, -4).replace(/\d/g, '*') + phoneNumber?.slice(-4);
  const updateMobileNo=()=>{
    const res = getUserSession()
    let localformData = res
    // localformData?.mobile_no='7718915767'
    // console.log(localformData)
    let updatedData={...localformData}

    updatedData.formData.policy_data.mobile_no=newMobileNumber

    updateMobileNotoLocal(newMobileNumber)

    
    showSuccessToast('Mobile Number Updated')
    setPhoneNumber(newMobileNumber)
    setPolicyData(updatedData?.formData)
    setShowMobileOTP(true)
    setIsChassisVerified(false)
    setTimer(300)
    setOtpInputs(['', '', '', '', '', ''])
    



  }

  const handleDownloadPDF = async (url) => {
    try {
      // console.log(Policy?.pdf_url)
      const pdfUrl = url;
      const response = await fetch(pdfUrl, {
        method: 'GET',
        mode: 'cors' // Ensures the request is treated as a CORS request
    });
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `policypdf.pdf`;

      downloadLink.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };




  const handleKeyPress = (e, index) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);

    if (/\D/.test(keyValue)) {
      e.preventDefault();
    }
  };


  useEffect(() => { 

    const data = getUserSession()
    console.log(data,'local Data')  
      if (!service || !dealer_id) {
      navigate('/Not-Found')
    }
  
  }, [showVerificationBox, policyData]);
  useEffect(()=>{ 
    if(showCaptcha&&!ShowMobileOTP){
    loadCaptchaEnginge(6)
  }
  },[showCaptcha,ShowMobileOTP])
  
  useEffect(() => {
  
      setParamsToLocal({ service, dealer_id });
    
  }, [service, dealer_id]); // Dependencies to re-run the effect if service or dealer_id changes

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpSent, timer]);


  const getPolicyData=async(pdata)=>{
    const res = await  makeApiCall(Api_Endpoints.policyData,'POST',{pdata:pdata})
    if(res?.status){
      showSuccessToast(res?.message)
      setsuccessPolicyData(res?.data)
      setpolicyPDF(res?.pdf_url)
      console.log(res,'success policy Data')

    }else{

      showErrorToast(res?.message)

    }
  }
  useEffect(()=>{

    if(location?.state?.from==='paymentTimeout'&& !engineNumber){

      setPaymentMessage(`Payment Timeout`)
      setPaymentStatus(false)
      setshowSearchBar(false)
      setShowPaymentStatus(true)
    }else if(location?.state?.from==='paymentSuccess'&& !engineNumber){
      setshowSearchBar(false)
      setPaymentMessage(`${location?.state?.paymentStatus}-${location?.state?.paymentMessage} `)

      getPolicyData(location?.state?.pdata)

        setPaymentStatus(true)
      setShowPaymentStatus(true)
    }else if(location?.state?.from==='paymentFailed'&& !engineNumber){
      setshowSearchBar(false)

      setPaymentStatus(false)
      setShowPaymentStatus(true)
      setPaymentMessage(`${location?.state?.paymentStatus}-${location?.state?.paymentMessage} `)

    }

  },[])


  return (
    <div className="HomeContainer">
    <img src={BackgroundImage} className='mainbackground'  />
    <div className="MainForm">
    
        <div className="frontbanner">
          <img src={RsaBanner} alt="RSA Banner" className='rsabanner'  />
          <div   onClick={() => window.location.href = 'tel:18002587111'}
 className='touchablediv' style={{cursor:'pointer'}}></div>
          <div>

            <p className="title">Road Side </p>
            <p className="title">Assistance (RSA)</p>

            
            <p className="subtitle1">We go the distance when it comes to your assistance</p>
          </div>
        </div>
        <div className='MainForm1'>
       {showSearchBar &&   <>
        <p className='title1' >Stay Covered: Renew or Purchase Your Policy with Ease</p>
        <div className='Searchcontainer'>
        <input 
          type='text' 
          value={engineNumber}
          onChange={handleInputChange}
          placeholder='Enter Engine Number'
          className='searchBar'
          maxLength='17' // HTML attribute to limit input length
        />
        <p onClick={searchEngineNumber} className='searchbutton'>Search</p>

      </div>
      </>}
    {showCaptcha&&!ShowMobileOTP&&  <div className='captchacontainer'>
        <p className='subtitle'>Captcha Verification</p>
      <LoadCanvasTemplate />
      <input
            type="text"
            className="captcha-input"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter Captcha"
          />
          <button type="submit" onClick={handleCaptchaVerify} className="Verify-Otp-button">Verify Captcha</button>
</div>
}
{/* OTP DIV */}
{phoneNumber  &&ShowMobileOTP&&<div className='otpverificationcontainer'>
  <p className='subtitle'>OTP Verification</p>

<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <p style={{color:'#4F4F4F',textAlign:'center',margin:'0px',fontSize:'18px'}}>Enter OTP Sent to {maskedPhoneNumber}</p>
              <Tippy
                  content={'Update Mobile No'}
                  placement="right"
                  
                  // className="rounded-sm text-xs"
                >
<p onClick={()=>setPhoneNumber(null)} style={{textDecoration:'underline',margin:'2px',fontWeight:'bolder',cursor:'pointer'}}>Edit</p>
</Tippy>

              </div>
              <div className="otp-inputs">
                {otpInputs.map((otp, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="tel"
                    className={`otp-input ${otp.length > 0 ? 'filled' : ''}`}
                    value={otp}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength="1"
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
                
              </div>
                <p className="otp-timer">OTP is valid for {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} min</p>
                    <button onClick={verifyOtp} className="Verify-Otp-button">Verify OTP</button>
{timer<240&&                    <p style={{fontSize:'14px',color:'#4F4F4F',marginTop:'10px'}}>Didn’t recieve OTP code? <span onClick={resendOtp} style={{color:'var(--label-button)',textDecoration:'underline',cursor:'pointer'}}> Resend Code</span></p>
}                  
              
                  

            
            </div>}

            {/* OTP DIV  Resend DIV*/}
       
               
               
           

              {/* Update Mobile Number Div */}
           { !phoneNumber && ShowMobileOTP&&!isChassisVerified&&  <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',padding:'10px'}}>
            <p className='updateMobiletitle'>Update Mobile Number</p>
            <p style={{color:'#4F4F4F',fontSize:'18px',textAlign:'center',marginBottom:'20px',marginTop:'20px'}}>Kindly provide the chassis number for verification</p>
            <input
                type="text"
                value={chassisNumber}
                onChange={(e) =>{
                  let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Limit the length of the chassis number
    if (value.length <= 17) {setChassisNumber(value);}
                }
                  
                  
                 }
                placeholder="Enter Chassis Number"
                className="chassis-input"
              />
              <button onClick={handleChassisSubmit} className="submit-button">Verify Chassis Number</button>  
              </div>}

          {isChassisVerified &&  (
            <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',padding:'10px'}}>
                        <p className='updateMobiletitle'>Update Mobile Number</p>

            <p style={{textAlign:'center',marginBottom:'10px',marginTop:'20px'}}>Please enter your new mobile number</p>
                    <input
                      type="tel"
                      value={newMobileNumber}
                      onChange={(e) => {
                        
                        let value = e.target.value.replace(/[^0-9]/g, '');
    
                        // Limit the length of the mobile number
                        if (value.length <= 10) {
                          setNewMobileNumber(value);
                        }
                    
                       }}
                      placeholder="Enter Mobile Number"
                      className="chassis-input"
                    />
                  <button onClick={updateMobileNo} className="submit-button">Update Mobile No</button>
                </div>
              )}

            {showpaymentstatus &&  (
             <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
             <p className='updateMobiletitle'>Payment Status</p>
             {paymentstatus === true ? (
              <div>
               <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px',fontSize:'20px',color:'var(--label-button)',fontWeight:'bold' }}>✅ Payment Successful!</p>
               {/* <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px' }}>Your payment of ₹1 has been received.</p> */}
               <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px' }}>{paymentMessage}</p>

                <p style={{textAlign:'center',fontSize:'22px',marginTop:'20px'}}>Policy Details</p>
                <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Name</p>
                <p className='policyDataValue'>{successPolicyData?.full_name}</p>
                 </div>

                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Engine no </p>
                <p className='policyDataValue'>{successPolicyData?.engine_no}</p>
                 </div>

                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Chassis No</p>
                <p className='policyDataValue'>{successPolicyData?.chassis_no}</p>
                 </div>

                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Plan Name</p>
                <p className='policyDataValue'>{successPolicyData?.plan_name}</p>
                 </div>

                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Sum Insured</p>
                <p className='policyDataValue'>{successPolicyData?.sum_insured}</p>
                 </div>


                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Amount</p>
                <p className='policyDataValue'>        {successPolicyData?.sold_policy_price_with_tax}
                </p>
                 </div>


                 <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Download:</p>
                <p  onClick={()=>handleDownloadPDF(policyPDF)} style={{backgroundColor:'#942B48',color:'white',padding:'5px',cursor:'pointer',borderRadius:'5px'}}> Policy PDF</p>
                 </div>


          


               



               </div>
             ) : (
              <div>
               <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px',fontSize:'20px',color:'var(--label-button)',fontWeight:'bold' }}>❌  Payment Failed!</p>
               <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px' }}> If the amount has been debited from your account, please contact the system administrator.</p>
               <p style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px' }}>{paymentMessage}</p>
              </div>
             )}
                  <button onClick={()=>{     navigate(location.pathname, { replace: true });    window.location.reload();

clearUserSession();setshowSearchBar(true);setShowPaymentStatus(false)}} className="submit-button">Refresh</button>

           </div>)}

           <div  className='policyDatalabelvalue'> 
                <p className='policyDatalabel'>Download:</p>
                <p  onClick={()=>handleDownloadPDF('https://myassistancenow.com/uat/tvsrsa_live/download_OICL_pdf/N3hxVWZETTNqbnhNSE9Ka1I5YlJJTGpKQi9YRXViMU54cE5NRTZDZkt6bz0=')} style={{backgroundColor:'#942B48',color:'white',padding:'5px',cursor:'pointer',borderRadius:'5px'}}> Policy PDF</p>
                 </div>
        </div>
      </div>
   {showLoader&&   <FullPageLoader/>}
   
</div>
  );
};

export default HomePage;
