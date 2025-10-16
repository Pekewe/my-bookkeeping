// src/components/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ user, onLogout, children }) => {
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <h1>个人记账系统</h1>
        <div className="user-info">
          <span>欢迎，{user.name}</span>
          <button onClick={onLogout}>退出</button>
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