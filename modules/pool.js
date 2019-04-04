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

//Should Encrypt?
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

//Should encrypt?
let postMusicStoryToken = (token, tokenSecret) => {
    query(
        `
        INSERT INTO MusicStoryTokens (token, token_secret)
        VALUES ("` + token + `", "` + tokenSecret + `");`
        )
}

let getMusicStoryToken = () => {
    return new Promise((resolve, reject) => {
        const sql =     `
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

//Oauth Server

let saveServerAccessToken = (accessToken) => {
pool.query(sql, {}, (err, rows)
   `
   INSERT INTO OauthServerAccessTokens (access_token, expires_at, scope, client_id, user_id)
   VALUES ("` 
   + accessToken.access_token + `", "` 
   + accessToken.expiresAt + `", "`
   + accessToken.scope + `", "`
   + accessToken.client_id +`", "`
   + accessToken.user.id + `");`
)
};

let saveServerRefreshToken = (refreshToken) => {
    pool.query(sql, {}, (err, rows)
    `
    INSERT INTO OauthServerRefrestTokens (access_token, expires_at, scope, client_id, user_id)
    VALUES ("` 
    + accessToken.refresh_token + `", "` 
    + accessToken.expiresAt + `", "`
    + accessToken.scope + `", "`
    + accessToken.client_id +`", "`
    + accessToken.user.id + `");`
 )
};

let queryAccessToken = (tokenObject) => {
    return new Promise((resolve, reject) => {
        const sql =     `
        SELECT *
        FROM OauthServerAccessTokens
        WHERE access_token = ` + tokenObject.accessToken + `;`   
    pool.query(sql, {}, (err, rows) => {
        if (err)
        return reject(err);
        var data = JSON.stringify(rows)
        console.log('Retrieved matching Token from Oauth table');
        resolve(rows);
      })
    })
};

let queryClient = (clientParams) => {
    return new Promise((resolve, reject) => {
        const sql =     `
        SELECT *
        FROM OauthClients
        WHERE id = ` + clientParams.clientId + `;`   
        //I am supposed to involve the client secret here... somehow...
    pool.query(sql, {}, (err, rows) => {
        if (err)
        return reject(err);
        var data = JSON.stringify(rows)
        console.log('Retrieved matching Client from Oauth Clients Table');
        resolve(rows);
      })
    })
};

let queryUser = (clientIdObject)=> {
let id = clientIdObject.id
return new Promise((resolve, reject) => {
    const sql =     
    `
    SELECT *
    FROM OauthUsers
    WHERE id = ` + clientParams.clientId + `;`   
    //I am supposed to involve the client secret here... somehow...
pool.query(sql, {}, (err, rows) => {
    if (err)
    return reject(err);
    var data = JSON.stringify(rows)
    console.log('Retrieved matching Client from Oauth Clients Table');
    resolve(rows);
  })
})
};


exports.postDbToken = postDbToken;
exports.getDbToken = getDbToken;

exports.postMusicStoryToken = postMusicStoryToken;
exports.getMusicStoryToken = getMusicStoryToken;

module.exports.query = query;
module.exports.pool = pool;

module.exports.saveServerAccessToken = saveServerAccessToken;
module.exports.saveServerRefreshToken = saveServerRefreshToken;
module.exports.queryAccessToken = queryAccessToken;
module.exports.queryClients = queryClient;
module.exports.queryUser = queryUser;
