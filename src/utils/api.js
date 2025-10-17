// src/utils/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// 统一的API请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

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