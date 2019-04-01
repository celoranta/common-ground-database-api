const axios = require('axios');
const base64 = require('base-64');
const formurlencoded = require('form-urlencoded').default;
var util = require('util') //Allow for circular refs in rturned json
var db = require('./pool.js');

var token = null;
var expirationDate = new Date();
let spotifyAuthString = base64.encode(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET);
const authUrl = 'https://accounts.spotify.com/api/token';
const requestBody = {
    grant_type: 'client_credentials'
};

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + spotifyAuthString,
    },
    transformRequest: [function (data, headers) {
        return formurlencoded(data);
    }]
};

function validOrNewToken() {
    return new Promise(
        function (resolve, reject) {
            if (expirationDate < new Date() || token == null) {
                console.log('No valid token in cache.  Requesting new token from Spotify')
                axios.post(authUrl, requestBody, config)
                    .then((result) => {
                        token = result.data.access_token
                        var expiresIn = result.data.expires_in
                        var dt = new Date();
                        dt.setSeconds(dt.getSeconds() + expiresIn - 300);
                        expirationDate = dt;
                        console.log('New Spotify Serverside Token Returned: ' + token);
                        console.log('Expires at: ' + expirationDate);
                        db.postDbToken(token, expirationDate)
                        resolve(token)
                    })
                    .catch((err) => {
                        token = null
                        console.log(err)
                        reject(err)
                    })
            }
            else {
                console.log('Using existing token. ')
                resolve(token)
            }
        })
}

var tokenPromise = db.getDbToken()
tokenPromise
    .then(function (tokenJSONObjectArray) {
        let tokenJSONObject = tokenJSONObjectArray[0] //Will we ever get multiple responses?
        console.log('SQL returned token object: ' + JSON.stringify(tokenJSONObject))

        console.log(tokenJSONObject.token)
        sqlToken = tokenJSONObject.token;
        sqlTokenExpiry = tokenJSONObject.expiresAt;
        if (expirationDate < new Date(sqlTokenExpiry)) {
            console.log('Token retrieved from SQL is newer.  Updating token and date vars.')
            token = sqlToken
            expirationDate = sqlTokenExpiry
        }
        validOrNewToken()
    })

async function apiCall(endpoint) {
    return new Promise(
        function (resolve, reject) {
            validOrNewToken()
                .then((validToken) => {
                    var url = 'https://api.spotify.com/v1'
                    var fullPath = url + endpoint
                    var tokenizedAuth = "Bearer " + validToken;
                    console.log('Attempting API call.')
                    console.log('Using auth: ' + tokenizedAuth)
                    console.log('To URL: ' + fullPath)
                    return {
                        'method': 'get',
                        'url': fullPath,
                        'responseType': 'JSON',
                        'headers': {
                            'Authorization': 'Bearer ' + validToken
                        }
                    }
                })
                .then(config => {
                    console.log('Using config: ' + config)
                    return axios(config)
                })
                .then((result) => {
                    const resultData = util.inspect(result.data)
                    console.log('Spotify Responded With: ' + resultData)
                    resolve(resultData)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
}


function search(query, type, market, limit, offset, include_external) {
    return new Promise(
        function (resolve, reject) {
            const endpoint = '/search?'
            //const validTypes = ['album', 'artist', 'playlist', 'track']
            const test = `q=` + query + `&type=` + type
            const testURI = endpoint + test
            apiCall(testURI)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
        }
    )
}

function analyze(trackId) {
    return new Promise(
        (resolve, reject) => {
            const endpoint = '/audio-analysis/'
            const uri = endpoint + trackId
            apiCall(uri)
                .then(result => {
                    resolve(result)
                })
                .catch(err => { 
                    reject(err) 
                })
        }
    )
}

function getPlaylist(playlistId) {
    return new Promise(
        (resolve, reject) => {
            const endpoint = '/playlists/'
            const uri = endpoint + playlistId;
            apiCall(uri)
            .then(result => {
                resolve(result)

            })
            .catch(err => {
                reject(err)
            })
        }
    )
}

//analysis('4zXvB4MoQD8onk0NCZbeHG')
getPlaylist('7Hrp9jGgpUHSsoARFTPpDN')
exports.search = search
exports.analyze = analyze
exports.call = (endpoint) => {
    apiCall(endpoint)
}