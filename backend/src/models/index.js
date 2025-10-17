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

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
};

testConnection();

module.exports = { sequelize, Sequelize };

// 导入所有模型
const Expense = require('./Expense');

// 初始化模型
const models = {
  Expense,
};

// 同步数据库（创建表）
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true 会删除现有表
    console.log('✅ 数据库表同步成功');
  } catch (error) {
    console.error('❌ 数据库表同步失败:', error);
  }
};

syncDatabase();

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};