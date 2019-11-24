module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'VyakarMaster',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'root',
    database: 'VyakarMaster',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'node-express-sequelize-starter-test',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
};
