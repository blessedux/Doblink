require('dotenv').config();

const dbConfig = {
  user: process.env.userDB,
  host: process.env.hostDB,
  database: process.env.database,
  password: process.env.passwordDB,
  port: process.env.portDB,
};



module.exports = { dbConfig };