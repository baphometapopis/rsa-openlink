import React, { useState, useEffect, useRef } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useNavigate } from 'react-router-dom';
import './VerifyHuman.css';
import { showErrorToast, showSuccessToast } from '../../Services/ToastServices/toastService';
import { makeApiCall } from '../../Services/Api/makeApiCall';
import { Api_Endpoints } from '../../Services/Api/apiEndpoint';
import { getUserSession, setFormDatatoLocal } from '../../Utils/localStorage';
import { toast } from 'react-toastify';

const VerifyHuman = ({ modelID, params }) => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [timer, setTimer] = useState(300);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [chassisNumber, setChassisNumber] = useState('');
  const [PolicyData,setPolicydata]=useState('')
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [isChassisVerified, setIsChassisVerified] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [ShowMobileOTP,setShowMobileOTP]=useState(false)

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpSent, timer]);

  useEffect(() => {
    if (timer === 0) {
      alert('OTP expired. Please resend OTP.');
      setIsOtpSent(false);
      setOtpInputs(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  }, [timer]);

  const handleCaptchaVerify = () => {
    if (validateCaptcha(captchaInput)) {
      setIsCaptchaVerified(true);
      // sendOtp()
    } else {
      alert('Captcha validation failed. Please try again.');
    }
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
    if (otp === '123456') { // Replace '123456' with actual OTP verification logic
      setIsOtpValid(true);

      showSuccessToast('OTP VERIFIED')
      navigate('Generate-Policy',{state:PolicyData})
      // if (modelID) {
      //   const res = await makeApiCall(Api_Endpoints?.GetplanDataBymodel, 'POST', {
      //     dealer_code: params?.dealer_id,
      //     policy_type: params?.service,
      //     model_id: modelID
      //   });

      //   if (res?.status) {
      //     if (res?.plan_array?.length > 0) {
      //       navigate('PlansSelection', { state: { plansData: res?.plan_array } });
      //     } else {
      //       showErrorToast('No Plan Found for this Model');
      //     }
      //   } else {
      //     showErrorToast(res?.message);
      //   }
      // } else {
      //   showErrorToast('Model Not Selected');
      // }
    } else {
      alert('Invalid OTP');
      setOtpInputs(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

  const resendOtp = () => {

    setIsOtpSent(true);
    setTimer(300);
    setOtpInputs(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
    
  };

  const updateMobileNo=()=>{
    const res = getUserSession()
    let localformData = res
    // localformData?.mobile_no='7718915767'
    let updatedData={...localformData}

    updatedData.formData.policy_data.mobile_no=newMobileNumber
console.log(updatedData.formData.policy_data.mobile_no)

    setFormDatatoLocal(updatedData)
    
    showSuccessToast('Mobile Number Updated')
    setPhoneNumber(newMobileNumber)
    setPolicydata(updatedData?.formData)
    setShowMobileOTP(true)
    



  }

  const handleKeyPress = (e, index) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);

    if (/\D/.test(keyValue)) {
      e.preventDefault();
    }
  };

  const handleChassisSubmit = async () => {
    // Add your API call or validation logic here

    if(chassisNumber===PolicyData?.policy_data?.chassis_no){
      setIsChassisVerified(true)
    }else{
      showErrorToast('Chassis Not matched')
    }
  
  };

  const maskedPhoneNumber = phoneNumber?.slice(0, -4).replace(/\d/g, '*') + phoneNumber?.slice(-4);

  useEffect(()=>{
    const res = getUserSession()
    console.log(res,'asdasdasdasdasdasdasdadad')
    setPolicydata(res)
    if(res?.formData?.policy_data?.mobile_no!==''){
    setPhoneNumber(res?.formData?.policy_data?.mobile_no)}else{
      showErrorToast('Mobile Number not Found')
    }
    setTimer(300)
    setIsOtpSent(true);


  },[])

  useEffect(()=>{
   
    // loadCaptchaEnginge(6)
},[ShowMobileOTP,maskedPhoneNumber])
useEffect(()=>{
  loadCaptchaEnginge(6)

},[])

    useEffect(()=>{setPolicydata(params)},[])
  return (
    <div className="verify-container">
      <div className='verifyHeader'>
        <p style={{ fontSize: '24px', fontWeight: '400' }}>Verification</p>
      </div>
      {!isCaptchaVerified ? (
        <div className="captcha-container">
          <LoadCanvasTemplate />
          <input
            type="text"
            className="captcha-input"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter Captcha"
          />
          <button type="submit" onClick={handleCaptchaVerify} className="submit-button">Verify Captcha</button>
        </div>
      ) : (
        <div>
          {maskedPhoneNumber || ShowMobileOTP ? (
            <div>
              <p style={{color:'#183882',textAlign:'center',margin:'10px',fontSize:'18px'}}>OTP has been sent to the Registered  Number {maskedPhoneNumber}</p>
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
              <div style={{ textAlign: 'center', margin: '10px' }}>
                {true ? (
                  <>
                    <p className="otp-timer">OTP is valid for {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} minutes</p>
                    <button onClick={verifyOtp} className="submit-button">Verify OTP</button>
                  </>
                ) : (
                  <button onClick={resendOtp} className="submit-button">Send OTP</button>
                )}
              </div>
              <div className='otp-resend-update-container'>
                <button onClick={resendOtp} className="link-button">Resend OTP</button>
                <button onClick={()=>{setShowMobileOTP(false);
    setPhoneNumber(null)}} className="link-button">Update Mobile No</button>
              </div>
            </div>
          ) : (
            <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',padding:'10px'}}>
              <p style={{textAlign:'center'}}>Please enter the chassis number for verification:</p>
              <input
                type="text"
                value={chassisNumber}
                onChange={(e) =>{
                  let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Limit the length of the chassis number
    if (value.length <= 17) {

      setChassisNumber(value);
    }
                }
                  
                  
                 }
                placeholder="Enter Chassis Number"
                className="chassis-input"
              />
              <button onClick={handleChassisSubmit} className="submit-button">Verify Chassis Number</button>

              {isChassisVerified && (
            <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',padding:'10px'}}>
            <p style={{textAlign:'center'}}>Please enter your new mobile number:</p>
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
                  <button onClick={updateMobileNo} className="submit-button">Send OTP</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyHuman;
