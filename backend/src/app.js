const express = require('express');
const cors = require('cors');
const app = express();
// 新增：导入数据库模型
const { sequelize, Expense } = require('./models');

// 中间件
app.use(cors());
app.use(express.json());

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

// 改为数据库版本
app.get('/api/expenses', async (req, res) => {
  try {
    const { type, category } = req.query;
    
    // 构建查询条件
    const where = {};
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

// 开发用：查看所有数据（完成后可删除）
app.get('/api/debug/expenses', async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: expenses,
      total: expenses.length
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

//改为数据库版本
app.post('/api/expenses', async (req, res) => {
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
    
    // 创建数据库记录
    const newExpense = await Expense.create({
      amount: parseFloat(amount),
      type,
      category,
      note: note || '',
      date: date || new Date().toISOString().split('T')[0]
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

// 路由 - 更新记账记录
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, type, category, note, date } = req.body;
  
  const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));
  
  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '记录不存在'
    });
  }
  
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    amount: amount ? parseFloat(amount) : expenses[expenseIndex].amount,
    type: type || expenses[expenseIndex].type,
    category: category || expenses[expenseIndex].category,
    note: note !== undefined ? note : expenses[expenseIndex].note,
    date: date || expenses[expenseIndex].date
  };
  
  res.json({
    success: true,
    message: '更新成功',
    data: expenses[expenseIndex]
  });
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

//改为数据库版本
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找记录是否存在
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: '记录不存在'
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