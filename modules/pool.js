//let mysql = require('mySql2');
let mysql = require('promise-mysql2')
let bcrypt = require('bcrypt');


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

async function query(sql, args) {
    pool.query(sql, args)
        .then((results) => { return results })
        .catch((err) => {
            console.log('Query Error: ' + err)
            return err
        })
};

//Spotify Token Methods

let postDbToken = (token, expiresAt) => {
    query(
        `
    INSERT INTO SpotifyTokens (token, expiresAt)
    VALUES ("` + token + `", "` + expiresAt + `");`
    )
}

let getDbToken = async () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = `\n        SELECT token, expiresAt\n        FROM SpotifyTokens\n        WHERE createAt = (SELECT MAX(createAt) FROM SpotifyTokens)\n        `;
            pool.query(sql, {}, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                else if (rows.length == 0) {
                    return reject(new Error('No existing tokens in database'));
                }
                else {
                    var data = JSON.stringify(rows);
                    console.log('Retrieved most recent Token from SQL: ' + data);
                    resolve(rows);
                }
            });
        });
    }
    catch (err_1) {
        return err_1;
    }
};

let postMusicStoryToken = (token, tokenSecret) => {
    query(
        `
        INSERT INTO MusicStoryTokens (token, token_secret)
        VALUES ("` + token + `", "` + tokenSecret + `");`
    )
}

//Music Story Methods

let getMusicStoryToken = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT token, token_secret
        FROM MusicStoryTokens
        WHERE createAt = (SELECT MAX(createAt) FROM MusicStoryTokens)
        `
        pool.query(sql, {}, (err, rows) => {
            if (err)
                return reject(err);
            var data = JSON.stringify(rows)
            console.log('Retrieved most recent Token from Music Story');
            resolve(rows);
        })
    })
};

//CommonGround Oauth Server

let willHash = (stringToHash) => {
    return new Promise((resolve, reject) => {
        console.log('Hashing: ' + stringToHash)
        bcrypt.hash(stringToHash, 10, (err, hash) => {
            if (err) {
                console.log('rejecting in willHash: ' + err)
                reject(err)
            }
            else {
                console.log('resolving willHash: ' + resolve)
                resolve(hash)
            }
        })
    })
};

async function createOauthUser(username, password, personId) {
    async function createUser(user, pass, id) {
        let hash = await willHash(pass)
        try {
            let sql = `
        INSERT INTO OauthUsers (user_name, password, personId)
        VALUES ("` 
        + user + `", "` 
        + hash + `", "` 
        + id + `");`
            let result = await pool.query(sql)
            console.log("Result of query: " + result)
            return result
        }
        catch (err) {
            console.log('User creation Error: ')
            console.log(err)
            return err
        }
    }
    return await createUser(username, password, personId)
}


exports.postDbToken = postDbToken;
exports.getDbToken = getDbToken;

exports.postMusicStoryToken = postMusicStoryToken;
exports.getMusicStoryToken = getMusicStoryToken;

module.exports.query = query;
module.exports.pool = pool;

exports.createOauthUser = createOauthUser;

