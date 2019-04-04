const axios = require('axios');
const base64 = require('base-64');
const formurlencoded = require('form-urlencoded').default;
var util = require('util') //Allow for circular refs in rturned json
var db = require('./pool.js');

var token = null;
let spotifyAuthString = base64.encode(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET);
const authUrl = 'https://accounts.spotify.com/api/token';

const request1Body = {
    grant_type: 'code'
};

const request2Body = {
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


let tokenRequest = (code) => {
    console.log('spotifyUserHandler received code: ' + code)
}

module.exports.tokenRequest = tokenRequest;

