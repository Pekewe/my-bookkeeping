// src/components/ExpenseList.js
import React, { useState, useMemo } from 'react';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDeleteExpense, filters }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    expenseId: null,
    expenseInfo: null
  });
  
  // 排序状态
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // 打开确认对话框
  const openConfirmDialog = (expenseId, expenseInfo) => {
    setConfirmDialog({
      isOpen: true,
      expenseId,
      expenseInfo
    });
  };

  // 关闭确认对话框
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      expenseId: null,
      expenseInfo: null
    });
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (confirmDialog.expenseId) {
      onDeleteExpense(confirmDialog.expenseId);
      closeConfirmDialog();
    }
  };
  
  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 检查是否是今天或昨天
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    }
    
    // 否则显示具体日期
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 根据排序选项对费用进行排序
  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses];
    
    switch (sortBy) {
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'amount-desc':
        return sorted.sort((a, b) => {
          // 支出为负数，收入为正数
          const aValue = a.type === 'expense' ? -a.amount : a.amount;
          const bValue = b.type === 'expense' ? -b.amount : b.amount;
          return bValue - aValue;
        });
      case 'amount-asc':
        return sorted.sort((a, b) => {
          const aValue = a.type === 'expense' ? -a.amount : a.amount;
          const bValue = b.type === 'expense' ? -b.amount : b.amount;
          return aValue - bValue;
        });
      case 'date-desc':
      default:
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [expenses, sortBy]);

  if (expenses.length === 0) {
    let emptyType = 'all';
    if (filters.type !== 'all') {
      emptyType = filters.type;
    }
    if (filters.search) {
      emptyType = 'search';
    }

    return (
      <div className="expense-list">
        <EmptyState type={emptyType} />
      </div>
    );
  }

  return (
    <>
      <div className="expense-list">
        <div className="list-header">
          <h3>记账记录 ({expenses.length}条)</h3>
          <div className="sort-options">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date-desc">最新优先</option>
              <option value="date-asc">最早优先</option>
              <option value="amount-desc">金额降序</option>
              <option value="amount-asc">金额升序</option>
            </select>
          </div>
        </div>
        <div className="expense-items">
          {sortedExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <span className="category">{expense.category}</span>
                <span className="date">{formatDate(expense.date)}</span>
              </div>
              <div className="expense-details">
                <span className={`amount ${expense.type}`}>
                  {expense.type === 'expense' ? '-' : '+'}{expense.amount}元
                </span>
                {expense.note && <span className="note">{expense.note}</span>}
              </div>
              <button 
                className="delete-btn"
                onClick={() => openConfirmDialog(
                  expense.id, 
                  `${expense.category} ${expense.type === 'expense' ? '支出' : '收入'} ${expense.amount}元`
                )}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 确认删除对话框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除记账记录"
        message={`您确定要删除 "${confirmDialog.expenseInfo}" 吗？此操作不可撤销。`}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirmDialog}
      />
    </>
  );
};

export default ExpenseList;