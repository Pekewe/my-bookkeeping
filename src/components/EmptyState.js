// src/components/EmptyState.js
import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  type = 'all', 
  title, 
  message, 
  action 
}) => {
  // 默认配置
  const configs = {
    all: {
      icon: '📊',
      title: '还没有记账记录',
      message: '开始记录您的第一笔收支吧！',
      action: '去记账'
    },
    expense: {
      icon: '💸',
      title: '还没有支出记录',
      message: '记录您的第一笔支出，更好地管理财务',
      action: '记录支出'
    },
    income: {
      icon: '💰',
      title: '还没有收入记录', 
      message: '记录您的第一笔收入，了解收入来源',
      action: '记录收入'
    },
    search: {
      icon: '🔍',
      title: '没有找到相关记录',
      message: '尝试调整搜索条件或筛选条件',
      action: '清除筛选'
    }
  };

  const config = configs[type] || configs.all;

  return (
    <div className="empty-state">
      <div className="empty-icon">{config.icon}</div>
      <h3 className="empty-title">{title || config.title}</h3>
      <p className="empty-message">{message || config.message}</p>
      {action && (
        <button className="empty-action">
          {config.action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;