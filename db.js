const mysql = require("mysql2");

// Create a MariaDB connection pool
dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
};
console.log(process.env.DB_NAME,"mintu dbcheck");

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();