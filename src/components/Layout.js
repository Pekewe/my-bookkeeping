// src/components/Layout.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // 添加useNavigate
import './Layout.css';
import { useAuth } from '../contexts/AuthContext';

// const Layout = ({ user, onLogout, children }) => {
//   // 使用认证上下文
//   const auth = useAuth();
//   console.log('认证上下文:', auth);
//   const location = useLocation();

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 使用认证上下文

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>个人记账系统</h1>
        <div className="user-info">
          {user ? (
            <>
              <span>欢迎，{user.name}</span>
              <button onClick={handleLogout}>退出</button>
            </>
          ) : (
            <span>未登录</span>
          )}
        </div>
      </header>

      <nav className="app-nav">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          仪表盘
        </Link>
        <Link 
          to="/expense" 
          className={location.pathname === '/expense' ? 'active' : ''}
        >
          记账
        </Link>
      </nav>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;