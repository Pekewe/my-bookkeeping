const express = require('express');
const cors = require('cors');
const app = express();
// 新增：导入数据库模型
const { sequelize, Expense } = require('./models');
// 导入认证工具
const { authenticate, generateToken } = require('./utils/auth');
const { User } = require('./models');

const { Op } = require('sequelize');

// 中间件
// 修改cors配置，允许来自3000端口的请求
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==================== 认证路由 ====================

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // 基础验证
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '所有字段都是必填的'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
      name
    });

    // 生成token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: user.toSafeObject(),
        token
      }
    });

  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败'
    });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login可以是username或email

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名/邮箱和密码是必填的'
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: login },
          { email: login }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // 生成token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: user.toSafeObject(),
        token
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

// 调试端点：检查token
app.get('/api/auth/debug-token', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Token验证成功',
    userId: req.userId
  });
});

// 获取当前用户信息
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

// 临时测试：跳过认证
// app.get('/api/auth/me', async (req, res) => {
//   try {
//     console.log('直接访问/me端点，头信息:', req.headers);
    
//     // 临时返回成功，确认端点可访问
//     res.json({
//       success: true,
//       message: '端点可访问',
//       headers: req.headers
//     });
    
//   } catch (error) {
//     console.error('获取用户信息失败:', error);
//     res.status(500).json({
//       success: false,
//       message: '获取用户信息失败'
//     });
//   }
// });


// 在现有路由后面添加数据库健康检查
app.get('/api/db-health', async (req, res) => {
  try {
    await sequelize.authenticate();
    const expenseCount = await Expense.count();
    
    res.json({
      success: true,
      message: '数据库连接正常',
      expenseCount: expenseCount,
      database: sequelize.config.dialect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: error.message
    });
  }
});

// 模拟数据 - 临时用内存存储
// 集成数据库之后删除
// let expenses = [
//   { 
//     id: 1, 
//     amount: 100, 
//     type: 'expense', 
//     category: '食品', 
//     note: '午餐',
//     date: '2024-01-15',
//     createdAt: new Date().toISOString()
//   },
//   { 
//     id: 2, 
//     amount: 3000, 
//     type: 'income', 
//     category: '工资', 
//     note: '月薪',
//     date: '2024-01-10',
//     createdAt: new Date().toISOString()
//   }
// ];

// let nextId = 3;

// 路由 - 获取所有记账记录
// app.get('/api/expenses', (req, res) => {
//   const { type, category } = req.query;
//   let filteredExpenses = expenses;
  
//   if (type) {
//     filteredExpenses = filteredExpenses.filter(expense => expense.type === type);
//   }
  
//   if (category) {
//     filteredExpenses = filteredExpenses.filter(expense => expense.category === category);
//   }
  
//   res.json({
//     success: true,
//     data: filteredExpenses,
//     total: filteredExpenses.length
//   });
// });

// 改为数据库版本 - 添加认证中间件
app.get('/api/expenses', authenticate, async (req, res) => {
  try {
    const { type, category } = req.query;
    
    // 构建查询条件
    const where = {
      userId: req.userId // 只返回当前用户的记录
    };
    if (type && type !== 'all') {
      where.type = type;
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    
    // 从数据库查询
    const expensesData = await Expense.findAll({
      where: where,
      order: [['date', 'DESC']] // 按日期倒序排列
    });
    
    res.json({
      success: true,
      data: expensesData,
      total: expensesData.length
    });
    
  } catch (error) {
    console.error('获取记账列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取数据失败'
    });
  }
});

// 开发用：查看当前用户的所有数据
app.get('/api/debug/expenses', authenticate, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.userId }, // 只查看当前用户的数据
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: expenses,
      total: expenses.length,
      userId: req.userId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 路由 - 添加新记账记录
// app.post('/api/expenses', (req, res) => {
//   const { amount, type, category, note, date } = req.body;
  
//   // 基础验证
//   if (!amount || !type || !category) {
//     return res.status(400).json({
//       success: false,
//       message: '金额、类型和分类是必填项'
//     });
//   }
  
//   if (amount <= 0) {
//     return res.status(400).json({
//       success: false,
//       message: '金额必须大于0'
//     });
//   }
  
//   const newExpense = {
//     id: nextId++,
//     amount: parseFloat(amount),
//     type,
//     category,
//     note: note || '',
//     date: date || new Date().toISOString().split('T')[0],
//     createdAt: new Date().toISOString()
//   };
  
//   expenses.push(newExpense);
  
//   res.status(201).json({
//     success: true,
//     message: '记账成功',
//     data: newExpense
//   });
// });

//改为数据库版本 - 添加认证中间件和用户关联
app.post('/api/expenses', authenticate, async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;
    
    // 验证（保持原有验证）
    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: '金额、类型和分类是必填项'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: '金额必须大于0'
      });
    }
    
    // 创建数据库记录 - 添加userId关联
    const newExpense = await Expense.create({
      amount: parseFloat(amount),
      type,
      category,
      note: note || '',
      date: date || new Date().toISOString().split('T')[0],
      userId: req.userId // 关联到当前用户
    });
    
    res.status(201).json({
      success: true,
      message: '记账成功',
      data: newExpense
    });
    
  } catch (error) {
    console.error('添加记账失败:', error);
    res.status(500).json({
      success: false,
      message: '添加记账失败'
    });
  }
});

// 路由 - 更新记账记录 - 改为数据库版本并添加认证中间件
app.put('/api/expenses/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, note, date } = req.body;
    
    // 查找记录并验证所有权
    const expense = await Expense.findOne({
      where: {
        id,
        userId: req.userId // 确保只更新当前用户的记录
      }
    });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: '记录不存在或无权操作'
      });
    }
    
    // 验证（如果提供了金额）
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: '金额必须大于0'
        });
      }
    }
    
    // 更新记录
    const updatedFields = {};
    if (amount !== undefined) updatedFields.amount = parseFloat(amount);
    if (type !== undefined) updatedFields.type = type;
    if (category !== undefined) updatedFields.category = category;
    if (note !== undefined) updatedFields.note = note;
    if (date !== undefined) updatedFields.date = date;
    
    await expense.update(updatedFields);
    
    res.json({
      success: true,
      message: '更新成功',
      data: expense
    });
    
  } catch (error) {
    console.error('更新记账失败:', error);
    res.status(500).json({
      success: false,
      message: '更新失败'
    });
  }
});

// 路由 - 删除记账记录
// app.delete('/api/expenses/:id', (req, res) => {
//   const { id } = req.params;
//   const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));
  
//   if (expenseIndex === -1) {
//     return res.status(404).json({
//       success: false,
//       message: '记录不存在'
//     });
//   }
  
//   const deletedExpense = expenses.splice(expenseIndex, 1)[0];
  
//   res.json({
//     success: true,
//     message: '删除成功',
//     data: deletedExpense
//   });
// });

//改为数据库版本 - 添加认证中间件和权限验证
app.delete('/api/expenses/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找记录并验证所有权
    const expense = await Expense.findOne({
      where: {
        id,
        userId: req.userId // 确保只删除当前用户的记录
      }
    });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: '记录不存在或无权操作'
      });
    }
    
    // 从数据库删除
    await expense.destroy();
    
    res.json({
      success: true,
      message: '删除成功',
      data: expense
    });
    
  } catch (error) {
    console.error('删除记账失败:', error);
    res.status(500).json({
      success: false,
      message: '删除失败'
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '记账系统后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `接口不存在: ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 记账系统后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📊 API文档: http://localhost:${PORT}/api/health`);
});