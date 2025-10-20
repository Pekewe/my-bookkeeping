import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // 登录/注册切换
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    username: '',
    email: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, register, loading: authLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  // 密码长度验证函数
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  // 表单验证函数
  const validateForm = () => {
    if (!isLogin) {
      // 注册表单验证
      if (!validatePassword(formData.password)) {
        setMessage('密码长度至少6位');
        return false;
      }
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowSuccess(false);
    
    // 先进行客户端验证
    if (!validateForm()) {
      return;
    }
    
    setLocalLoading(true); // 通过验证后才设置loading
    
    console.log('=== 开始提交 ===');
    console.log('isLogin:', isLogin);
    console.log('formData:', formData);
    
    let result = null;
    
    try {
      if (isLogin) {
        console.log('执行登录逻辑');
        result = await login({
          login: formData.login,
          password: formData.password
        });
        console.log('登录结果:', result);
  
        if (result.success) {
          console.log('登录成功，设置消息');
          setMessage('登录成功！');
          setShowSuccess(true);
        } else {
          setMessage(result.message);
        }
      } else {
        console.log('执行注册逻辑');
        result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        console.log('注册结果:', result);
  
        if (result.success) {
          console.log('注册成功，设置showSuccess=true');
          setMessage('注册成功！请登录您的账户');
          setShowSuccess(true);
          console.log('showSuccess设置为true，应该显示成功提示');
          
          console.log('启动1.5秒定时器');
          setTimeout(() => {
            console.log('定时器执行：切换到登录表单');
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              login: formData.username,
              password: '',
              username: '',
              email: '',
              name: ''
            }));
            setShowSuccess(false);
            setLocalLoading(false); // 重要：重置loading状态
            console.log('showSuccess设置为false，隐藏成功提示');
          }, 1500); // 改为1500毫秒
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      console.error('提交错误:', error);
      setMessage('操作失败，请重试');
    } finally {
      // 确保loading状态正确重置
      if (!isLogin && result?.success) {
        // 注册成功的情况在定时器中处理
      } else {
        setLocalLoading(false);
      }
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>个人记账系统</h1>
        
        <div className="auth-tabs">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button> 
          <button 
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            // 登录表单
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="用户名或邮箱"
                  value={formData.login}
                  onChange={(e) => handleChange('login', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="密码（至少6位）"
                  value={formData.password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    handleChange('password', newPassword);
                    // 实时显示密码长度提示
                    if (!isLogin && newPassword && newPassword.length < 6) {
                      setMessage('密码长度至少6位');
                    } else if (message === '密码长度至少6位') {
                      setMessage('');
                    }
                  }}
                  required
                  minLength={6}
                />
                {!isLogin && formData.password && formData.password.length > 0 && (
                  <small className={formData.password.length >= 6 ? 'valid-hint' : 'invalid-hint'}>
                    {formData.password.length}/6 字符
                  </small>
                )}
              </div>
            </>
          ) : (
            // 注册表单
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="邮箱"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="姓名"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="密码"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>
            </>
          )}

        {/* 调试信息 */}
        <div style={{background: '#f5f5f5', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
          <div>调试信息:</div>
          <div>showSuccess: {showSuccess.toString()}</div>
          <div>message: "{message}"</div>
          <div>isLogin: {isLogin.toString()}</div>
        </div>

        {/* 临时调试：强制显示成功提示 */}
        <div style={{
          background: 'red', 
          color: 'white', 
          padding: '10px', 
          margin: '10px 0',
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1000
        }}>
          强制显示：showSuccess = {showSuccess.toString()}
        </div>

          {/* 成功提示 - 使用更醒目的样式 */}
            {showSuccess && (
            <div className="message success highlight">
              {message}
              <div className="success-tip">
                {isLogin ? '正在跳转...' : '即将跳转到登录页面...'}
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {message && !showSuccess && (
            <div className="message error">
              {message}
            </div>
          )}

          <button type="submit" disabled={localLoading} className="auth-btn">
            {localLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;