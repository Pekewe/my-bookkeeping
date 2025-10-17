// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Loading from './components/Loading';
import Toast from './components/Toast';
import { expenseAPI, healthCheck } from './utils/api.js';

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

// 新增：数据加载函数
const loadExpenses = async () => {
  try {
    setLoading(true);
    //console.log('正在从API加载数据...');
    const result = await expenseAPI.getExpenses();
    setExpenses(result.data);
    //console.log('数据加载成功，共', result.data.length, '条记录');
  } catch (error) {
    console.error('加载数据失败:', error);
  } finally {
    setLoading(false);
  }
};

// Toast关闭函数
const closeToast = () => {
  setToast(null);
};

  // 加载本地数据
  // useEffect(() => {
  //   if (user) {
  //     const saved = localStorage.getItem('expenses');
  //     if (saved) setExpenses(JSON.parse(saved));
  //   }
  // }, [user]);

  // 登录
  // 修改后的登录函数
  const handleLogin = async () => {
    setUser(mockUser);
    await loadExpenses();// 只保留API加载
  };

  // 新增：用户登录时自动加载数据
  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);



  // 退出
  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
  };

  // 添加记账
// 修改后的添加记账函数
const addExpense = async (expenseData) => {
  try {
    setLoading(true);
    //console.log('正在提交记账数据...', expenseData);
    
    // 调用API添加数据
    const result = await expenseAPI.addExpense(expenseData);
    
    // API返回的数据已经包含id和createdAt
    const newExpense = result.data;
    
    // 更新本地状态
    setExpenses(prev => [...prev, newExpense]);
    
    // 显示成功提示
    setToast({ message: '记账成功！', type: 'success' });
    
    console.log('记账成功:', newExpense);
    
  } catch (error) {
    console.error('添加记账失败:', error);
    setToast({ message: `添加失败: ${error.message}`, type: 'error' });
  } finally {
    setLoading(false);
  }
};

  // 删除记账
// 修改后的删除记账函数
const deleteExpense = async (id) => {
  try {
    setLoading(true);
    //console.log('正在删除记录:', id);
    
    // 调用API删除数据
    await expenseAPI.deleteExpense(id);
    
    // 更新本地状态
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    
    // 显示成功提示
    setToast({ message: '删除成功！', type: 'success' });
    
    console.log('删除成功:', id);
    
  } catch (error) {
    console.error('删除记账失败:', error);
    setToast({ message: `删除失败: ${error.message}`, type: 'error' });
    
    // 如果API删除失败，重新加载数据确保同步
    await loadExpenses();
  } finally {
    setLoading(false);
  }
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

  // 在App组件中添加测试效果
// useEffect(() => {
//   const testConnection = async () => {
//     try {
//       console.log('测试API连接...');
//       const health = await healthCheck();
//       console.log('后端服务状态:', health);
//     } catch (error) {
//       console.error('API连接失败:', error);
//     }
//   };
  
//   testConnection();
// }, []);

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