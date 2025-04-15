// Create a new file: src/components/Notification.js

import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = ({ show, message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  // Auto hide after 3 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  // Set background color based on type
  const getBgClass = () => {
    switch (type) {
      case 'success': return 'bg-success text-white';
      case 'danger': return 'bg-danger text-white';
      case 'warning': return 'bg-warning';
      default: return 'bg-light';
    }
  };

  // Set icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'danger': return 'bi-exclamation-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      default: return 'bi-info-circle-fill';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
      <Toast 
        show={visible} 
        onClose={() => { setVisible(false); if (onClose) onClose(); }}
        className={`${getBgClass()} shadow`}
        delay={3000}
        autohide
      >
        <Toast.Header className="bg-white text-dark">
          <i className={`bi ${getIcon()} me-2`}></i>
          <strong className="me-auto">AgroConnect</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification;