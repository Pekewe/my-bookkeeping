// backend/src/utils/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // token有效期7天

// 生成JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 验证JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('无效的token');
  }
};

// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    console.log('=== 完整的请求头 ===');
    console.log('Headers:', req.headers);
    console.log('Authorization头:', req.header('Authorization'));
    console.log('authorization头:', req.header('authorization')); // 小写试试
    
    const authHeader = req.header('Authorization') || req.header('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('提取的token:', token);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，请先登录'
      });
    }

    const decoded = verifyToken(token);
    console.log('解码的token:', decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    res.status(401).json({
      success: false,
      message: 'token无效或已过期'
    });
  }
};
module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  JWT_SECRET
};