// src/components/ExpenseList.js
import React, { useState } from 'react';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDeleteExpense, filters }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    expenseId: null,
    expenseInfo: null
  });

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
        <h3>记账记录 ({expenses.length}条)</h3>
        <div className="expense-items">
          {expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <span className="category">{expense.category}</span>
                <span className="date">{expense.date}</span>
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