// src/components/ExpenseFilter.js
import React from 'react';
import './ExpenseFilter.css';

const ExpenseFilter = ({ filters, onFilterChange }) => {
  // 确保filters对象有dateRange属性
  const safeFilters = {
    dateRange: { start: '', end: '' },
    quickDate: 'custom',
    ...filters
  };
  
  // 处理快捷日期选择
  const handleQuickDateChange = (value) => {
    if (value === 'custom') {
      // 选择自定义时重置日期范围，显示全部数据
      onFilterChange('dateRange', { start: '', end: '' });
      onFilterChange('quickDate', value);
      return;
    }
    
    const today = new Date();
    let startDate, endDate;
    const formatDate = (date) => {
      // 避免时区问题，确保日期格式为YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // 计算不同日期范围
    switch (value) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case 'thisWeek':
        startDate = new Date(today);
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一
        startDate.setDate(diff);
        endDate = new Date(today);
        break;
      case 'lastWeek':
        startDate = new Date(today);
        const lastWeekDay = startDate.getDay();
        const lastWeekDiff = startDate.getDate() - lastWeekDay + (lastWeekDay === 0 ? -6 : 1) - 7;
        startDate.setDate(lastWeekDiff);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'firstHalfYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 5, 30);
        break;
      case 'secondHalfYear':
        startDate = new Date(today.getFullYear(), 6, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case 'thisYear':
        // 手动构建本年1月1日，避免时区问题
        startDate = new Date();
        startDate.setFullYear(today.getFullYear(), 0, 1);
        // 确保时间设置为00:00:00
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        break;
      case 'lastYear':
        // 手动构建去年1月1日，避免时区问题
        const lastYear = today.getFullYear() - 1;
        startDate = new Date();
        startDate.setFullYear(lastYear, 0, 1);
        // 确保时间设置为00:00:00
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setFullYear(lastYear, 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return;
    }
    
    // 更新日期范围和快捷日期选项
    onFilterChange('dateRange', {
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
    onFilterChange('quickDate', value);
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
        
        {/* 快捷日期筛选 */}
        <select 
          value={safeFilters.quickDate}
          onChange={(e) => handleQuickDateChange(e.target.value)}
          className="quick-date-select"
        >
          <option value="custom">全部</option>
          <option value="today">今天</option>
          <option value="yesterday">昨天</option>
          <option value="thisWeek">本周</option>
          <option value="lastWeek">上周</option>
          <option value="thisMonth">本月</option>
          <option value="lastMonth">上月</option>
          <option value="firstHalfYear">上半年</option>
          <option value="secondHalfYear">下半年</option>
          <option value="thisYear">本年</option>
          <option value="lastYear">去年</option>
        </select>
        
        {/* 日期范围筛选 */}
        <div className="date-range">
          <input
            type="date"
            value={safeFilters.dateRange.start}
            onChange={(e) => {
              onFilterChange('dateRange', {
                ...safeFilters.dateRange,
                start: e.target.value
              });
              // 自定义日期时更新快捷日期选项
              onFilterChange('quickDate', 'custom');
            }}
            max={new Date().toISOString().split('T')[0]}
            placeholder="开始日期"
          />
          <span className="date-separator">至</span>
          <input
            type="date"
            value={safeFilters.dateRange.end}
            onChange={(e) => {
              onFilterChange('dateRange', {
                ...safeFilters.dateRange,
                end: e.target.value
              });
              // 自定义日期时更新快捷日期选项
              onFilterChange('quickDate', 'custom');
            }}
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