// src/components/Toast.js
import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    // 只有当show为true时才设置定时器
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // 只有当show为true时才渲染
  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

export default Toast;