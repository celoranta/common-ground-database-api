const axios = require('axios');
const base64 = require('base-64');
const formurlencoded = require('form-urlencoded').default;
var token = null;
var expirationDate = new Date();
let spotifyAuthString = base64.encode(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET);
const url = 'https://accounts.spotify.com/api/token';
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

var validOrNewToken = new Promise(
    function (resolve, reject) {
        if (expirationDate < new Date()) {
            axios.post(url, requestBody, config)
                .then((result) => {
                    token = result.data.access_token
                    var expiresIn = result.data.expires_in
                    var dt = new Date();
                    dt.setSeconds(dt.getSeconds() + expiresIn - 10);
                    expirationDate = dt;
                    resolve(token)
                }) 
                .catch((err) => {
                    token = null
                    console.log(err)
                    reject(err)
                }      
                )}
                else {
                    resolve(token)
                }
    }
)

var getValidOrNewToken = function() {
 validOrNewToken
 .then(function (fulfilled) {
     console.log('New Spotify Serverside Token Returned: ' + fulfilled);
     console.log('Expires at: ' + expirationDate);
 })
 .catch(function(error) {
     console.log(error.message) 
 })
}



getValidOrNewToken();
