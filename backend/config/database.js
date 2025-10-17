// backend/config/database.js
const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: console.log, // 显示SQL日志，便于学习
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // 测试使用内存数据库
  },
  production: {
    dialect: 'sqlite', 
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false, // 生产环境关闭日志
  }
};