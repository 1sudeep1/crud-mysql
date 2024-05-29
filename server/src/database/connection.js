const mysql= require('mysql2')
require('dotenv').config();
const db =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud-mysql'
  });

  db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connected successfully');
    if (connection) connection.release();
});

  module.exports= db