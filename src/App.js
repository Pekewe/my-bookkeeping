// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Loading from './components/Loading';
import Toast from './components/Toast';
import { expenseAPI } from './utils/api.js';
import { useAuth } from './contexts/AuthContext'; // 合并导入

// 导入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExpensePage from './pages/ExpensePage';
import Layout from './components/Layout';

function App() {
  // 使用认证上下文
  const { user, loading: authLoading } = useAuth();
  
  const [expenses, setExpenses] = useState([]);
  // 初始过滤条件
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
    dateRange: { start: '', end: '' }
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // 数据加载函数
  const loadExpenses = async () => {
    try {
      setDataLoading(true);
      const result = await expenseAPI.getExpenses();
      setExpenses(result.data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Toast关闭函数
  const closeToast = () => {
    setToast(null);
  };

  // 用户登录时自动加载数据
  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  // 删除handleLogout函数 - Layout现在使用认证上下文的logout

  // 添加记账
  const addExpense = async (expenseData) => {
    try {
      setDataLoading(true);
      const result = await expenseAPI.addExpense(expenseData);
      const newExpense = result.data;
      setExpenses(prev => [...prev, newExpense]);
      setToast({ message: '记账成功！', type: 'success' });
    } catch (error) {
      console.error('添加记账失败:', error);
      setToast({ message: `添加失败: ${error.message}`, type: 'error' });
    } finally {
      setDataLoading(false);
    }
  };

  // 删除记账
  const deleteExpense = async (id) => {
    try {
      setDataLoading(true);
      await expenseAPI.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      setToast({ message: '删除成功！', type: 'success' });
    } catch (error) {
      console.error('删除记账失败:', error);
      setToast({ message: `删除失败: ${error.message}`, type: 'error' });
      await loadExpenses();
    } finally {
      setDataLoading(false);
    }
  };

  // 过滤处理
  const handleFilterChange = (field, value) => {
    if (field === 'reset') {
      // 重置所有过滤条件
      setFilters({
        type: 'all',
        category: 'all',
        search: '',
        dateRange: { start: '', end: '' },
        quickDate: 'custom'
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 过滤后的数据
  const filteredExpenses = expenses.filter(expense => {
    // 类型过滤
    if (filters.type !== 'all' && expense.type !== filters.type) return false;
    
    // 分类过滤
    if (filters.category !== 'all' && expense.category !== filters.category) return false;
    
    // 搜索过滤
    if (filters.search && !expense.note?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    // 日期范围过滤
    if (filters.dateRange?.start && new Date(expense.date) < new Date(filters.dateRange.start)) {
      return false;
    }
    if (filters.dateRange?.end) {
      // 确保结束日期包含当天的所有记录
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(expense.date) > endDate) {
        return false;
      }
    }
    
    return true;
  });

  // if (authLoading && !user && !localStorage.getItem('token')) {
  //   return <div>应用初始化中...</div>;
  // }

  return (
    // 删除外层的AuthProvider - 已经在index.js中包装了
    <Router>
      <div className="App">
        {/* 全局加载状态 */}
        {dataLoading && <Loading message="处理中..." />}
        
        {/* Toast提示 */}
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
              user ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          
          {/* 需要登录的路由 */}
          <Route 
            path="/*" 
            element={
              user ? (
                // 修改：Layout不需要传递props
                <Layout>
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

// 在index.js中包装AuthProvider
export default App;