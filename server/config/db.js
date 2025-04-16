const { Sequelize } = require('sequelize');
const config = require('config');

const dbConfig = config.get('db');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
})();

module.exports = sequelize;