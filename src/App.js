// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Loading from './components/Loading';
import Toast from './components/Toast';

// 导入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExpensePage from './pages/ExpensePage';
import Layout from './components/Layout';

// 模拟用户
const mockUser = {
  id: 1,
  name: '测试用户'
};

function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

// Toast关闭函数
const closeToast = () => {
  setToast(null);
};

  // 加载本地数据
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('expenses');
      if (saved) setExpenses(JSON.parse(saved));
    }
  }, [user]);

  // 登录
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      const saved = localStorage.getItem('expenses');
      if (saved) setExpenses(JSON.parse(saved));
      setLoading(false);
    }, 1000);
  };



  // 退出
  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
  };

  // 添加记账
  const addExpense = (expenseData) => {
    setLoading(true);
    
    setTimeout(() => {
      const newExpense = {
        id: Date.now(),
        ...expenseData,
        date: new Date().toLocaleDateString()
      };
      const newExpenses = [...expenses, newExpense];
      setExpenses(newExpenses);
      localStorage.setItem('expenses', JSON.stringify(newExpenses));
      setLoading(false);
      setToast({ message: '记账成功！', type: 'success' });
    }, 500);
  };

  // 删除记账
  const deleteExpense = (id) => {
    setLoading(true);
    
    setTimeout(() => {
      const newExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(newExpenses);
      localStorage.setItem('expenses', JSON.stringify(newExpenses));
      setLoading(false);
      setToast({ message: '删除成功！', type: 'success' });
    }, 500);
  };

  // 过滤处理
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 过滤后的数据
  const filteredExpenses = expenses.filter(expense => {
    if (filters.type !== 'all' && expense.type !== filters.type) return false;
    if (filters.category !== 'all' && expense.category !== filters.category) return false;
    if (filters.search && !expense.note.includes(filters.search)) return false;
    return true;
  });

  return (
    <Router>
      <div className="App">
        {/* 全局加载状态 - 放在最外层 */}
        {loading && <Loading message="处理中..." />}
        
        {/* Toast提示 - 放在最外层 */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={closeToast} 
          />
        )}
        
        <Routes>
          {/* 登录页 */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          
          {/* 需要登录的路由 */}
          <Route 
            path="/*" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route 
                      path="/dashboard" 
                      element={
                        <Dashboard
                          expenses={expenses}
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          onDeleteExpense={deleteExpense}
                          filteredExpenses={filteredExpenses}
                        />
                      } 
                    />
                    <Route 
                      path="/expense" 
                      element={<ExpensePage onAddExpense={addExpense} />} 
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;