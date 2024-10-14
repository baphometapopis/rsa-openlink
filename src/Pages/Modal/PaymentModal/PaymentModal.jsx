import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import './PaymentModal.css';
import { useNavigate } from 'react-router-dom';
import { clearUserSession, getParamsFromLocal } from '../../../Utils/localStorage';
import { makeApiCall } from '../../../Services/Api/makeApiCall';
import { Api_Endpoints } from '../../../Services/Api/apiEndpoint';
import { showSuccessToast } from '../../../Services/ToastServices/toastService';

const PaymentModal = ({ visible, onClose, data,policyID }) => {

  data={
    "status": true,
    "message": "SUCCESS",
    "data": "{\"head\":{\"responseTimestamp\":\"1728564184617\",\"version\":\"v1\",\"clientId\":\"C11\",\"signature\":\"lT/lTAyJuTwJmXUaCEN5w8fF5HXVx6vDJDEiPPFoxG6HqOgE3G9YbxZrUfsm+u81PFmRbLCNHcLrWTfEC/mLCmxP4Wxfi/2oUUrsewaqz2w=\"},\"body\":{\"resultInfo\":{\"resultStatus\":\"SUCCESS\",\"resultCode\":\"QR_0001\",\"resultMsg\":\"SUCCESS\"},\"qrCodeId\":\"2700005050XXXXX2NNGLX9TW\",\"qrData\":\"upi://pay?pa=paytm-49581899@ptybl&pn=INDICOSMIC%20CAPITAL%20PVT%20LTD&mc=7549&tr=BA00025982525380&am=1.00&cu=INR\",\"image\":\"iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgAQAAAABVr4M4AAADjklEQVR42u3dS5KjMAyAYWXFMTgqHJVjsLInYOthkhD1zCymav4sUgnhozcu27Jkt9Q/eAkYDP7ruEh/Tc9P83Ftm85rj+NzkeV4k3mX9mnZ9P4FDM7hpTqZ+o3tMfUkuz3m+LRNVb+CwTl8tLjluLgeeDlIb56tUT5/mJ/ufPM/Agb/EJeXpmifnk/V1goG/y4+mufxmtVJ/6rX7I+AwT/CfYjtuPV47eeqw+7RH66z3vdmfAaDP2IPE1ov+OXtU4wBBr/F/iqtF9RA1CPPh07ibtZJwOAPWH9uXZzGoKtM1m7FJnHWUbaVDzA4hcXc4k3P7gmvOYQJYbkWDP6GJ5uc7R6SWsvUhVuNH3ofuYDBOazLGh4rnOtoZ+Tp7XZIEoDBaVxtWcPXZ23qVm06t+uihw27FQxOY1u98NHVHmhrG+0xmz5rAYNzePWLmzyu1Rdrn7rZ16rpdTA4g/uAec7QwiLtrENsbSknH2z3sTADDL7HsbM7l8tWzzHVIVmuw66lC8DgHJY2pvroWnvLbKu3OruTdp8+tYLBWWxp88vUbfOSRl/08NQAGJzARZvdtQ62T+fWWCprDwwJATD4Fg9RZp+wyZAd1ypZzw/0qAEMTuFY5iOxhmzp5Ysx26TlQGBwGoc1/m0acpz97mopJwn1PwsYnMHDwNqSmpYib0RH17gQ4uWLYHAKaw1jtfAzXltDTUZMOYHBGSw+869eh120zExnd9WWdYcSbDA4hcWyAuOeXk0DPK6LbhUMzuJzTLWuMCYEZGijbYvvY6xMA4NvcRxTQ9VFX6m1fSOTT/GsIhsMzuPVWmGPNz1JYOlNmUqc04HBSezNLgynoXwxblRaPZwAgzO4xLWNkE8K7TGe3iND2hwM/oqr9W62R0kkHhI171bX6Of4gMFZXEKE0A/p0WT5arHCso01tCEQBYPv8Zhy8pD0UokdIlR52agEBt/hYX1W32SyusbdcpzhoEUwOIlLXNu4zNpCLmAoB4phAhh8j8etcH5Eoh+rog01bMWstbzZRwcGv8GvR0NVn7pNMfzUUu0yps3B4C/YS6vj8WJevhiC0xJOs17A4CTevKo6bN2N2c6h6kfiDgEwOI19j1I8Fn21suzePP0gdTD4x3i6nN7jhRkaK7weoAgGf8HxPDs7EMoLr/0xu/WHL5M4MPgjDmGClcV63umyAc6fCgan8P/438LA4H8W/wLfAid+RJenogAAAABJRU5ErkJggg==\"}}",
    "pdata": null,
    "redirection_url": "https://www.tvsservice.com/upipaymentprocess/NDI3MjI1OA%3D%3D"
}


// const upiLinkTemplate = 'upi://pay?pa=paytm-49581899@paytm&pn=INDICOSMIC%20CAPITAL%20PVT%20LTD&mc=7549&tid=121313202101345671229366&tr=TVS00012146756408&am=1.00&cu=INR&mode=00&purpose=00';

data = JSON.parse(data?.data);

  const [timeLeft, setTimeLeft] = useState(300);
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();



  const { head = {}, body = {} } = data || {};
  const { resultInfo = {}, image } = body;
  const { resultStatus, resultCode, resultMsg,qrCodeId } = resultInfo;


let upiLinkTemplate= data?.body?.qrData
  //  console.log(,'data')
   const openUpiApp = () => {
    const upiLink = upiLinkTemplate;
    // window.open(upiLink);
        window.location.href = upiLink;

  };


 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  

  useEffect(() => {
    if (!visible) return;

    const url = new URL(upiLinkTemplate);
    const params = new URLSearchParams(url.search);
    const upiAmount = params.get('am');
    setAmount(upiAmount);

    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          clearUserSession();
          navigate('/', { state: { from: 'paymentTimeout' }, replace: true });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const apiCallInterval = setInterval(async () => {
  const res = await makeApiCall(Api_Endpoints?.getPaymentStatus,'POST',{pdata:policyID})
const data = getParamsFromLocal()

let url = `/${data.service}/${data.dealer_id}`
      console.log(res,'paymentFailed')
    if(res?.status){
      showSuccessToast(res?.message)
if(res?.payment_status==='TXN_FAILURE')
{
  clearUserSession()
      navigate(url, { state: { from: 'paymentFailed',paymentStatus:res?.payment_status,paymentMessage:res?.message }, replace: true });
}else if(res?.payment_status==='TXN_SUCCESS'){
  clearUserSession()

  navigate(url, { state: { from: 'paymentSuccess',paymentStatus:res?.payment_status,paymentMessage:res?.message,pdata:policyID}, replace: true });
}
    }

 
    }, 10000); // 10 seconds

    window.addEventListener('resize', checkIsMobile);

    return () => {
      clearInterval(timer);
      clearInterval(apiCallInterval);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [visible, onClose]);


  return (
    <Modal
      visible={visible}
      footer={null}
      title="Payment"
      onCancel={onClose}
    >
      <div className="modal-content">
        <div className="company-logo-container">
          <img src={"https://www.tvsservice.com/assets/images/tvs.png"} alt="Company Logo" className="company-logo" />
        </div>
        
        {image && (
          <img src={`data:image/png;base64,${image}`} alt="QR Code" className="qr-code" />
        )}
        <p className="payment-amount"><strong>Amount:</strong> ₹{amount}</p>
        <p className="time-left"><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
        {isMobile && (
          <Button type="primary" onClick={openUpiApp} className="submit-button">
            Pay Using UPI APP
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
