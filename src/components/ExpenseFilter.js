// src/components/ExpenseFilter.js
import React from 'react';
import './ExpenseFilter.css';

const ExpenseFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="expense-filter">
      <h4>筛选条件</h4>
      <div className="filter-controls">
        <select 
          value={filters.type} 
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="all">所有类型</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
        
        <select 
          value={filters.category} 
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="all">所有分类</option>
          <option value="食品">食品</option>
          <option value="交通">交通</option>
          <option value="工资">工资</option>
          {/* 添加更多分类 */}
        </select>
        
        <input
          type="text"
          placeholder="搜索备注..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExpenseFilter;