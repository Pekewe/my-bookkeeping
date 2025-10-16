// src/components/ExpenseSummary.js
import React from 'react';
import './ExpenseSummary.css';

const ExpenseSummary = ({ expenses }) => {
  // 计算统计数据
  const totalIncome = expenses
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = expenses
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;

  // 分类统计
  const categoryStats = expenses.reduce((stats, item) => {
    if (!stats[item.category]) {
      stats[item.category] = { expense: 0, income: 0 };
    }
    stats[item.category][item.type] += item.amount;
    return stats;
  }, {});

  return (
    <div className="expense-summary">
      <h3>财务概览</h3>
      
      <div className="summary-cards">
        <div className="summary-card income">
          <h4>总收入</h4>
          <div className="amount">+{totalIncome.toFixed(2)}元</div>
        </div>
        
        <div className="summary-card expense">
          <h4>总支出</h4>
          <div className="amount">-{totalExpense.toFixed(2)}元</div>
        </div>
        
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h4>结余</h4>
          <div className="amount">
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)}元
          </div>
        </div>
      </div>

      <div className="category-breakdown">
        <h4>分类统计</h4>
        {Object.keys(categoryStats).length > 0 ? (
          <div className="category-list">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <div className="category-amounts">
                  {stats.income > 0 && (
                    <span className="income">+{stats.income.toFixed(2)}</span>
                  )}
                  {stats.expense > 0 && (
                    <span className="expense">-{stats.expense.toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">暂无数据</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;