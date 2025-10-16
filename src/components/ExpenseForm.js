// src/components/ExpenseForm.js
import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '食品',
    note: ''
  });
  
  // 新增：提交状态
  const [submitting, setSubmitting] = useState(false);

  const categories = {
    expense: ['食品', '交通', '娱乐', '购物', '医疗', '房租', '水电费', '其他'],
    income: ['工资', '奖金', '投资', '兼职', '分红', '退款', '其他收入']
  };

  // 添加快捷分类配置
const quickCategories = {
  expense: [
    { name: '早餐', amount: 15, icon: '🍳' },
    { name: '午餐', amount: 30, icon: '🍱' },
    { name: '晚餐', amount: 40, icon: '🍽️' },
    { name: '咖啡', amount: 25, icon: '☕' },
    { name: '交通', amount: 10, icon: '🚇' },
    { name: '零食', amount: 20, icon: '🍿' }
  ],
  income: [
    { name: '工资', amount: 0, icon: '💰' },
    { name: '奖金', amount: 0, icon: '🎁' },
    { name: '兼职', amount: 0, icon: '💼' }
  ]
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('请输入有效的金额');
      return;
    }

    if (formData.amount > 1000000) {
      alert('金额过大，请检查输入');
      return;
    }

    // 设置提交状态
    setSubmitting(true);

    // 模拟异步操作，让用户看到提交状态
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // 重置表单和提交状态
    setFormData({
      amount: '',
      type: 'expense',
      category: '食品',
      note: ''
    });
    
    setSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      if (field === 'type') {
        return {
          ...prev,
          [field]: value,
          category: categories[value][0]
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>添加记账记录</h3>
      
      <div className="form-group">
        <label>类型：</label>
        <div className="type-buttons">
          <button
            type="button"
            className={formData.type === 'expense' ? 'active expense' : ''}
            onClick={() => handleChange('type', 'expense')}
            disabled={submitting}
          >
            支出
          </button>
          <button
            type="button"
            className={formData.type === 'income' ? 'active income' : ''}
            onClick={() => handleChange('type', 'income')}
            disabled={submitting}
          >
            收入
          </button>
        </div>
      </div>

<div className="form-group">
  <label>金额：</label>
  <input
    type="number"
    placeholder="0.00"
    value={formData.amount}
    data-type={formData.type}
    onChange={(e) => {
      const value = e.target.value;
      // 允许空值、正数、小数
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        handleChange('amount', value);
      }
    }}
    onBlur={(e) => {
      // 失去焦点时格式化：保留2位小数
      const value = e.target.value;
      if (value && parseFloat(value) > 0) {
        handleChange('amount', parseFloat(value).toFixed(2));
      }
    }}
    min="0"
    step="0.01"
    disabled={submitting}
  />
</div>

      {/* 快捷金额按钮 */}
<div className="quick-amounts">
  <span>快捷金额：</span>
  <div className="amount-buttons">
    {[10, 20, 50, 100, 200, 500].map(amount => (
      <button
        key={amount}
        type="button"
        className="amount-btn"
        onClick={() => handleChange('amount', amount.toString())}
        disabled={submitting}
      >
        {amount}元
      </button>
    ))}
  </div>
</div>

{/* 快捷分类 */}
<div className="quick-categories">
  <span>常用分类：</span>
  <div className="category-buttons">
    {quickCategories[formData.type].map((item, index) => (
      <button
        key={index}
        type="button"
        className="category-btn"
        onClick={() => {
          handleChange('category', item.name);
          if (item.amount > 0) {
            handleChange('amount', item.amount.toString());
          }
        }}
        disabled={submitting}
      >
        <span className="category-icon">{item.icon}</span>
        <span className="category-name">{item.name}</span>
        {item.amount > 0 && (
          <span className="category-amount">{item.amount}元</span>
        )}
      </button>
    ))}
  </div>
</div>

      <div className="form-group">
        <label>分类：</label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          disabled={submitting}
        >
          {categories[formData.type].map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

{/* 快捷备注 */}
<div className="quick-notes">
  <span>常用备注：</span>
  <div className="note-buttons">
    {['日常消费', '工作餐', '交通费', '购物', '娱乐', '其他'].map((note) => (
      <button
        key={note}
        type="button"
        className="note-btn"
        onClick={() => handleChange('note', note)}
        disabled={submitting}
      >
        {note}
      </button>
    ))}
  </div>
</div>

      <div className="form-group">
        <label>备注：</label>
        <input
          type="text"
          placeholder="备注信息（可选）"
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
          disabled={submitting}
        />
      </div>


      <button 
        type="submit" 
        className="submit-btn"
        disabled={submitting}
      >
        {submitting ? '提交中...' : '确认记账'}
      </button>
    </form>
  );
};

export default ExpenseForm;