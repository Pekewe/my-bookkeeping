// backend/src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: dbConfig.logging,
});

// 导入模型定义函数
const ExpenseDefinition = require('./Expense');
const UserDefinition = require('./User');

// 初始化模型
const Expense = ExpenseDefinition(sequelize);
const User = UserDefinition(sequelize);

// 定义模型关系
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId' });

// 测试连接和同步
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
};

const syncDatabase = async () => {
  try {
    // 恢复为正常模式，不删除现有数据
    await sequelize.sync({ force: false });
    console.log('✅ 数据库表同步成功');
  } catch (error) {
    console.error('❌ 数据库表同步失败:', error);
  }
};

testConnection();
syncDatabase();

module.exports = {
  sequelize,
  Sequelize,
  Expense,
  User,
};