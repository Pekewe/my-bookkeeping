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

  const categories = {
    expense: ['食品', '交通', '娱乐', '购物', '医疗', '其他'],
    income: ['工资', '奖金', '投资', '兼职', '其他收入']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('请输入有效的金额');
      return;
    }

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // 重置表单
    setFormData({
      amount: '',
      type: 'expense',
      category: '食品',
      note: ''
    });
    
    alert('记账成功！');
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      // 如果修改了类型，重置分类为对应类型的第一个
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
          >
            支出
          </button>
          <button
            type="button"
            className={formData.type === 'income' ? 'active income' : ''}
            onClick={() => handleChange('type', 'income')}
          >
            收入
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>金额：</label>
        <input
          type="number"
          placeholder="输入金额"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>分类：</label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {categories[formData.type].map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>备注：</label>
        <input
          type="text"
          placeholder="备注信息（可选）"
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
        />
      </div>

      <button type="submit" className="submit-btn">
        确认记账
      </button>
    </form>
  );
};

export default ExpenseForm;