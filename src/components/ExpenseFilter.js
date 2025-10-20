// src/components/ExpenseFilter.js
import React from 'react';
import './ExpenseFilter.css';

const ExpenseFilter = ({ filters, onFilterChange }) => {
  // 确保filters对象有dateRange属性
  const safeFilters = {
    dateRange: { start: '', end: '' },
    ...filters
  };
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
          value={filters.category || 'all'} 
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="all">所有分类</option>
          <option value="食品">食品</option>
          <option value="交通">交通</option>
          <option value="工资">工资</option>
          <option value="购物">购物</option>
          <option value="娱乐">娱乐</option>
          <option value="医疗">医疗</option>
          <option value="教育">教育</option>
          <option value="其他">其他</option>
        </select>
        
        {/* 日期范围筛选 */}
        <div className="date-range">
          <input
            type="date"
            value={safeFilters.dateRange.start}
            onChange={(e) => onFilterChange('dateRange', {
              ...safeFilters.dateRange,
              start: e.target.value
            })}
            max={new Date().toISOString().split('T')[0]}
            placeholder="开始日期"
          />
          <span className="date-separator">至</span>
          <input
            type="date"
            value={safeFilters.dateRange.end}
            onChange={(e) => onFilterChange('dateRange', {
              ...safeFilters.dateRange,
              end: e.target.value
            })}
            max={new Date().toISOString().split('T')[0]}
            placeholder="结束日期"
          />
        </div>
        
        <input
          type="text"
          placeholder="搜索备注..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        
        {/* 重置按钮 */}
        <button 
          className="reset-btn"
          onClick={() => onFilterChange('reset', {})}
        >
          重置筛选
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;