// Create a new file: src/contexts/NotificationContext.js

import React, { createContext, useState, useContext } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
}