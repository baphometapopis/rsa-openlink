import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

const PaymentModal = ({ visible, onClose, data }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
 let  upiLink='upi://pay?pa=paytm-49581899@paytm&pn=INDICOSMIC%20CAPITAL%20PVT%20LTD&mc=7549&tid=121313202101345671229366&tr=TVS00012146756408&am=1.00&cu=INR&mode=00&purpose=00'
  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, onClose]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const openUpiApp=()=>{
    window.open(upiLink);


  }

  const { head = {}, body = {} } = data || {};
  const { responseTimestamp, version, clientId, signature } = head;
  const { resultInfo = {}, qrCodeId, qrData, image } = body;
  const { resultStatus, resultCode, resultMsg } = resultInfo;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title="Payment"
    >
      <div>
        {/* Uncomment these lines if you need to display additional data */}
        {/* <p><strong>Response Timestamp:</strong> {responseTimestamp}</p>
        <p><strong>Version:</strong> {version}</p>
        <p><strong>Client ID:</strong> {clientId}</p>
        <p><strong>Signature:</strong> {signature}</p>
        <p><strong>Status:</strong> {resultStatus}</p>
        <p><strong>Code:</strong> {resultCode}</p>
        <p><strong>Message:</strong> {resultMsg}</p>
        <p><strong>QR Code ID:</strong> {qrCodeId}</p> */}
        {/* {qrData && (
          <p><strong>UPI Link:</strong> <a href={qrData} target="_blank" rel="noopener noreferrer">{qrData}</a></p>
        )} */}
        {image && (
          <img src={`data:image/png;base64,${image}`} alt="QR Code" />
        )}
  <p style={{backgroundColor:'red',textAlign:'center',padding:'10px',borderRadius:'10px',color:'white',cursor:'pointer'}} onClick={openUpiApp}> Pay Using UPI APP </p>

        <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
      </div>
      <Button onClick={onClose}>Close</Button>
    </Modal>
  );
};

export default PaymentModal;
