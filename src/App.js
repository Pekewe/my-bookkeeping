// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseFilter from './components/ExpenseFilter';

// 模拟用户登录状态
const mockUser = {
  id: 1,
  name: '测试用户'
};

function App() {
  // 用户信息
  const [user, setUser] = useState(null); 
  
  // 所有记账数据
  const [expenses, setExpenses] = useState([]); 
  
  // 当前标签页
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // 新增：过滤条件
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });

  // 模拟登录
  const handleLogin = () => {
    setUser(mockUser);
    // 从localStorage加载数据
    const saved = localStorage.getItem('expenses');
    if (saved) setExpenses(JSON.parse(saved));
  };

  // 模拟退出
  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
  };

  // 添加记账
  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      date: new Date().toLocaleDateString()
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  // 过滤函数
const filteredExpenses = expenses.filter(expense => {
  // 类型过滤
  if (filters.type !== 'all' && expense.type !== filters.type) {
    return false;
  }
  // 分类过滤
  if (filters.category !== 'all' && expense.category !== filters.category) {
    return false;
  }
  // 搜索过滤
  if (filters.search && !expense.note.includes(filters.search)) {
    return false;
  }
  return true;
});

// 过滤处理函数
const handleFilterChange = (field, value) => {
  setFilters(prev => ({
    ...prev,
    [field]: value
  }));
};

  // 在App组件中添加删除函数
  const deleteExpense = (id) => {
  const newExpenses = expenses.filter(expense => expense.id !== id);
  setExpenses(newExpenses);
  localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  // 如果没有登录，显示登录页
  if (!user) {
    return (
      <div className="login-page">
        <h1>个人记账系统</h1>
        <button onClick={handleLogin}>点击登录（演示）</button>
        <p>提示：这只是演示，后续会实现真实登录</p>
      </div>
    );
  }

  // 登录后的主界面
  return (
    <div className="app">
      <header className="app-header">
        <h1>个人记账系统</h1>
        <div className="user-info">
          <span>欢迎，{user.name}</span>
          <button onClick={handleLogout}>退出</button>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          仪表盘
        </button>
        <button 
          className={activeTab === 'expense' ? 'active' : ''}
          onClick={() => setActiveTab('expense')}
        >
          记账
        </button>
      </nav>

      <main className="app-main">
      {/* // 更新仪表盘部分 */}
      {activeTab === 'dashboard' && (
  <div>
    <ExpenseFilter 
      filters={filters} 
      onFilterChange={handleFilterChange} 
    />
    <ExpenseSummary expenses={filteredExpenses} />
    <ExpenseList 
      expenses={filteredExpenses} 
      onDeleteExpense={deleteExpense} 
    />
  </div>
)}
        
{activeTab === 'expense' && (
  <div>
    <ExpenseForm onAddExpense={addExpense} />
  </div>
)}
      </main>
    </div>
  );
}

export default App;