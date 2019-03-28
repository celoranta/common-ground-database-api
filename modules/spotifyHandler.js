const axios = require('axios');
const base64 = require('base-64');
const formurlencoded = require('form-urlencoded').default;
var util = require('util') //Allow for circular refs in rturned json
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

var validOrNewToken = new Promise(
    function (resolve, reject) {
        if (expirationDate < new Date() || token == null) {
            console.log('No valid token in cache.  Requesting new token from Spotify')
            axios.post(authUrl, requestBody, config)
                .then((result) => {
                    token = result.data.access_token
                    var expiresIn = result.data.expires_in
                    var dt = new Date();
                    dt.setSeconds(dt.getSeconds() + expiresIn - 600);
                    expirationDate = dt;
                    console.log('New Spotify Serverside Token Returned: ' + token);
                    console.log('Expires at: ' + expirationDate);
                    resolve(token)
                })
                .catch((err) => {
                    token = null
                    console.log(err)
                    reject(err)
                }
                )
        }
        else {
            resolve(token)
        }
    }
)

// var getValidOrNewToken = function () {
//     validOrNewToken
//         .then(function (fulfilled) {
//             return fulfilled
//         })
//         .catch(function (error) {
//             console.log(error.message)
//         })
// }

async function apiCall2(endpoint) {
    validToken = await validOrNewToken;
    var url = 'https://api.spotify.com/v1'
    var fullPath = url + endpoint
    var tokenizedAuth = "Bearer " + validToken;
    console.log('Attempting API call.')
    console.log('Using auth: ' + tokenizedAuth)
    console.log('To URL: ' + fullPath)
    // GET request for remote image
axios({
    'method': 'get',
    'url': fullPath,
    'responseType': 'JSON',
    'headers' : {
    'Authorization': 'Bearer ' + validToken
    }
    }
  ).then((result) => {
    console.log('Spotify Responded With: ' + util.inspect(result.data))})
    .catch((err)=>{console.log(err)})
  };


let ugh = ()=> {
apiCall2('/tracks/2TpxZ7JUBn3uw46aR7qd6V')
// .then(console.log('Success??'))
// .catch((err)=>{console.log(err)})
}

ugh();
//curl -H "Authorization: Bearer NgCXRKc...MzYjw" https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V
