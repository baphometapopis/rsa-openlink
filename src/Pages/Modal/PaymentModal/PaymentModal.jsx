import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import './PaymentModal.css';
import { useNavigate } from 'react-router-dom';
import { clearUserSession } from '../../../Utils/localStorage';

const PaymentModal = ({ visible, onClose, data }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 5 minutes = 300 seconds
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  // Sample UPI link
  const upiLinkTemplate = 'upi://pay?pa=paytm-49581899@paytm&pn=INDICOSMIC%20CAPITAL%20PVT%20LTD&mc=7549&tid=121313202101345671229366&tr=TVS00012146756408&am=1.00&cu=INR&mode=00&purpose=00';

  useEffect(() => {
    if (!visible) return;

    // Extract amount from UPI link
    const url = new URL(upiLinkTemplate);
    const params = new URLSearchParams(url.search);
    const upiAmount = params.get('am');
    setAmount(upiAmount);

    // Check if the device is mobile or tablet
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile(); // Initial check

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // onClose();
          clearUserSession()
          navigate('/', { state: { from: 'paymentTimeout' }, replace: true }); // Replace with your desired path and params

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [visible, onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const openUpiApp = () => {
    const upiLink = `upi://pay?pa=paytm-49581899@paytm&pn=INDICOSMIC%20CAPITAL%20PVT%20LTD&mc=7549&tid=121313202101345671229366&tr=TVS00012146756408&am=${amount}&cu=INR&mode=00&purpose=00`;
    window.open(upiLink);
  };

  // Destructure the necessary data from the provided data object
  const { head = {}, body = {} } = data || {};
  const { responseTimestamp, version, clientId, signature } = head;
  const { resultInfo = {}, qrCodeId, qrData, image, companyLogo } = body;
  const { resultStatus, resultCode, resultMsg } = resultInfo;

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
