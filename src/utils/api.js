// src/utils/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// 统一的API请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 获取本地存储的token
  const token = localStorage.getItem('token');
  
  // 构建请求头，自动添加token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 如果有token，添加到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    const data = await response.json();
    
    // 处理401错误（token过期或无效）
    if (response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 可以在这里添加重定向到登录页的逻辑
      console.error('认证失败，请重新登录');
    }
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 认证相关API
export const authAPI = {
  // 用户登录
  login: (loginData) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });
  },

  // 用户注册
  register: (registerData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },

  // 验证token有效性
  validateToken: () => {
    return apiRequest('/auth/debug-token');
  }
};

// 记账相关API
export const expenseAPI = {
  // 获取记账列表
  getExpenses: (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type && filters.type !== 'all') {
      queryParams.append('type', filters.type);
    }
    if (filters.category && filters.category !== 'all') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    const queryString = queryParams.toString();
    const url = `/expenses${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url);
  },

  // 添加记账
  addExpense: (expenseData) => {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  // 更新记账
  updateExpense: (id, expenseData) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  // 删除记账
  deleteExpense: (id) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// 健康检查
export const healthCheck = () => {
  return apiRequest('/health');
};


// 重复的authAPI声明已删除