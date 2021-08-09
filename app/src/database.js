const mysql = require('promise-mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'coworking_user',
    password: 'coworking123456',
    database: 'coworking'
});

function getConnection(){
    return connection;
}

module.exports = {getConnection};