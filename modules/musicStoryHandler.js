const env = require('dotenv').config()
const utf8 = require('utf8')
const axios = require('axios');
const jsSHA = require('jssha')
//const formurlencoded = require('form-urlencoded').default;
//var util = require('util') //Allow for circular refs in rturned json
var db = require('./pool.js');

var token = null;
var expirationDate = new Date();
//let musicStoryAuthString = base64.encode(process.env.SPOTIFY_APP_CLIENT_ID + ":" + process.env.SPOTIFY_APP_CLIENT_SECRET);
const oauth_consumer_key = process.env.MUSICSTORY_CONSUMER_KEY
const oauth_consumer_secret = process.env.MUSICSTORY_CONSUMER_SECRET

const httpString = 'http://'
const baseUrl = 'api.music-story.com';
const authURI = '/oauth/request_token';
const fullURL = httpString + baseUrl + authURI 
const authCallMethod = 'GET'

var params = "oauth_consumer_key=" + oauth_consumer_key//Could add ternary with token_secret
var params = encodeURIComponent(params);
var url = encodeURIComponent(fullURL);
let rawSig = authCallMethod + "&" + url + "&" + params;
console.log("Raw signature with UTF-8 encoded parameters: " + rawSig);
var encodingKey = utf8.encode(oauth_consumer_secret + "&")
console.log("UTF-8 Encoded 'encoding' key: " + encodingKey);

var shaObj = new jsSHA("SHA-1", "TEXT");
shaObj.setHMACKey(encodingKey, "TEXT");
shaObj.update(rawSig);
var sig = shaObj.getHMAC("B64");
console.log("Base-64 encoded signature: " + sig);

var request = 'http://api.music-story.com/oauth/request_token?oauth_consumer_key=' + oauth_consumer_key + '&oauth_signature=' + sig;
console.log("Complete HTTP request: " + request);

