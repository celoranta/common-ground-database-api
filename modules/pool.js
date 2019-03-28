let mysql = require('mySql2');


//Create Database Connection
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

function query(sql, args) {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};


let postDbToken = (token, expiresAt) => {
    query(
    `
    INSERT INTO SpotifyTokens (token, expiresAt)
    VALUES ("` + token + `", "` + expiresAt + `");`
    )
}

let getDbToken = () => {
    return new Promise((resolve, reject) => {
        const sql =     `
        SELECT token, expiresAt
        FROM SpotifyTokens
        WHERE createAt = (SELECT MAX(createAt) FROM SpotifyTokens)
        `
    pool.query(sql, {}, (err, rows) => {
        if (err)
        return reject(err);
        var data = JSON.stringify(rows)
        console.log('Retrieved most recent Token from SQL');
        resolve(rows);
      })
    })
    };


exports.postDbToken = postDbToken;
exports.getDbToken = getDbToken;



module.exports.query = query;
module.exports.pool = pool;