// src/components/ExpenseList.js
import React from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <p>暂无记账记录</p>
        <p>点击"记账"标签开始记录您的收支</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h3>记账记录</h3>
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
              onClick={() => onDeleteExpense(expense.id)}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;