import React from 'react';
import { Modal, Button } from 'antd';

const ErrorModal = ({ visible, onClose, error }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      title="Error"
    >
      <div>
        <p><strong>{error}</strong> </p>
        
      </div>
    </Modal>
  );
};

export default ErrorModal;
