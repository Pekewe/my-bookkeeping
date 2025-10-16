// src/components/ConfirmDialog.js
import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  title = "确认删除", 
  message = "您确定要删除这条记录吗？此操作不可撤销。", 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button 
            className="confirm-btn cancel-btn"
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            className="confirm-btn confirm-danger-btn"
            onClick={onConfirm}
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;