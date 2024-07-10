import React, { useState, useEffect, useRef } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useNavigate } from 'react-router-dom';
import './VerifyHuman.css';
import { showErrorToast } from '../../Services/ToastServices/toastService';
import { makeApiCall } from '../../Services/Api/makeApiCall';
import { Api_Endpoints } from '../../Services/Api/apiEndpoint';

const VerifyHuman = ({modelID,params}) => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [timer, setTimer] = useState(60); // 5 minutes in seconds
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleCaptchaVerify = () => {
    if (validateCaptcha(captchaInput)) {
      setIsCaptchaVerified(true)

      
      // sendOtp()
    } else {
      alert('Captcha validation failed. Please try again.')
    }
  }


  // Focus the first OTP input box when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Function to handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Move to the next input box automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Function to handle OTP verification
  const verifyOtp = async () => {
    const otp = otpInputs.join('');

    // Simulate OTP verification process
    if (otp === '123456') { // Replace '123456' with actual OTP verification logic
      setIsOtpValid(true);

      if(modelID){

        const res = await makeApiCall(Api_Endpoints?.GetplanDataBymodel,'POST',{dealer_code:params?.dealer_id,policy_type:params?.service,model_id:modelID})
        if(res?.status){
          if(res?.plan_array?.length>0){
          navigate('PlansSelection',{ state: { plansData: res?.plan_array } });
}else{
  showErrorToast('No Plan Found for this Model')
}
        }else{
          showErrorToast(res?.message)
        }

      }else{
        showErrorToast('Model Not Selected')
      }

      
      
      // Navigate to the next page upon successful verification
    } else {
      alert('Invalid OTP');
      // Reset OTP inputs and focus on the first input box
      setOtpInputs(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

  // Effect to handle OTP timer countdown
  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpSent, timer]);
 
  // Effect to handle OTP expirationm
  useEffect(() => {
    if (timer === 0) {
      alert('OTP expired. Please resend OTP.');
      setIsOtpSent(false);
      setOtpInputs(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  }, [timer]);

useEffect(()=>{loadCaptchaEnginge(6)},[])

  // Function to handle OTP resend
  const resendOtp = () => {
    setIsOtpSent(true);
    setTimer(300);
    setOtpInputs(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  // Function to handle OTP input validation
  const handleKeyPress = (e, index) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);

    // Only allow numeric digits
    if (/\D/.test(keyValue)) {
      e.preventDefault();
    }
  };

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
        <div className="otp-container">
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
          {isOtpSent ? (
            
            <div style={{textAlign:'center'}}>
               <p className="otp-timer">OTP is valid for {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} minutes</p>
              {timer === 0 && (
                <button onClick={resendOtp} className="submit-button">Resend OTP</button>
              )}
              <button onClick={verifyOtp} className="submit-button">Verify OTP</button>
             
            </div>
          ) : (
            <button onClick={resendOtp} className="submit-button">Send OTP</button>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyHuman;
