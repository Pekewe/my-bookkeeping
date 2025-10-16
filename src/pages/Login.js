// src/pages/Login.js
import React from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>个人记账系统</h1>
        <p>管理您的个人财务，轻松记账</p>
        <button onClick={onLogin} className="login-btn">
          开始使用
        </button>
        <div className="demo-tip">
          <small>演示版本 - 后续会实现真实登录</small>
        </div>
      </div>
    </div>
  );
};

export default Login;