// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api'; // 导入认证API

// 创建认证上下文
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 初始化：如果有token，验证token并获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          setToken(savedToken);
          // 自动验证token并获取用户信息
          console.log('检测到保存的token，正在验证...');
          const userInfo = await authAPI.getCurrentUser();
          if (userInfo.success) {
            setUser(userInfo.data);
            console.log('自动登录成功，用户信息已获取');
          } else {
            console.log('token验证失败');
            logout();
          }
        } catch (error) {
          console.error('自动登录失败:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 登录函数 - 改为真实API
  const login = async (loginData) => {
    try {
      setLoading(true);
      
      // 调用真实登录API
      const result = await authAPI.login(loginData);
      
      if (result.success) {
        const { user: userData, token: userToken } = result.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        console.log('登录成功，用户信息:', userData);

        return { success: true, user: userData };
      } else {
        return { success: false, message: result.message };
      }
      
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: error.message || '登录失败，请重试' };
    } finally {
      setLoading(false);
    }
  };

  // 注册函数 - 改为真实API
  const register = async (registerData) => {
    try {
      setLoading(true);
      
      // 调用真实注册API
      const result = await authAPI.register(registerData);
      
      if (result.success) {
        // 注册成功，但不自动登录
        // 只返回成功信息，不设置用户状态
        return { 
          success: true, 
          message: '注册成功！请登录',
          user: result.data.user // 返回用户信息但不设置状态
        };
      } else {
        return { success: false, message: result.message };
      }
      
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 退出函数
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // 上下文值
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};