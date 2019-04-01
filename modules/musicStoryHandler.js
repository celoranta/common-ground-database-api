const convert = require('xml-js');
const xml2js = require('xml2js');
const env = require('dotenv').config()
const utf8 = require('utf8')
const axios = require('axios');
const jsSHA = require('jssha')
var db = require('./pool.js');

const baseUrl = 'http://api.music-story.com';
const oauth_consumer_secret = process.env.MUSICSTORY_CONSUMER_SECRET
var token = null;
var token_secret = null;

//var expirationDate = new Date();


function requestNewToken() {
    const oauth_consumer_key = process.env.MUSICSTORY_CONSUMER_KEY


    //const httpString = 'http://'
    // const authURI = 
    const fullURL = /*httpString + */baseUrl + '/oauth/request_token';
    const authCallMethod = 'GET'
    var params = "oauth_consumer_key=" + oauth_consumer_key
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
    //let sig2 = createSignature('GET', 'http://api.music-story.com/oauth/request_token', ['oauth_consumer_key=' + oauth_consumer_key])
    var tokenRequest = 'http://api.music-story.com/oauth/request_token?oauth_consumer_key=' + oauth_consumer_key + '&oauth_signature=' + sig;
    console.log("Complete HTTP request: " + tokenRequest);
    return new Promise(function (resolve, reject) {
        //console.log('No valid token in cache.  Requesting new token from Music Story')
        axios.get(tokenRequest)
            .then((result) => {
                let response = result.data
                resolve(response)
            })
            .catch((err) => {
                token = null
                console.log(err)
                reject(err)
            })
    })
}

function createSignature(method, endpoint, parameters) {

    parameters.sort();
    parameters = parameters.join("&")
    console.log('Raw parameters: ' + parameters)
    var encodedParameters = encodeURIComponent(parameters)
    console.log('Encoded parameters: ' + encodedParameters)
    parameters = encodedParameters;
    console.log('UTF-8 encoded URL: ' + url)
    var sig = method + "&" + url + "&" + parameters;
    console.log("Non-Encrypted signature: " + sig)

    var encodingKey = oauth_consumer_secret + "&" + token_secret;
    console.log('Raw Encoding Key: ' + encodingKey)
    encodingKey = utf8.encode(encodingKey);
    console.log('UTF-8 encoded encoding-key: ' + encodingKey)
    var url = encodeURIComponent(baseUrl + endpoint);

    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(encodingKey, "TEXT");
    shaObj.update(sig);
    sig = shaObj.getHMAC("B64");
    console.log("Base-64 encoded signature: " + sig);
    return sig
}

async function apiCall(method, endpoint, parameters) {
    return new Promise(
        function (resolve, reject) {
            if (token != null) {
                parameters.push('oauth_token=' + token)
                // console.log('parameters being passed to signature creation: ' + parameters)
                let sig = createSignature(method, endpoint, parameters);
                //UTF-8 encode the components
                console.log('Final sig: ' + sig)
                let request = baseUrl + endpoint + `?` + `name=Bob%20Marley` + `&oauth_token=` + token + `&oauth_signature=` + sig;
                console.log(request)
                axios.get(request)
                    .then((result) => {
                        var parseString = xml2js.parseString;
                        var xml = result;
                        parseString(xml, function (err, result2) {
                            response = result2
                            console.log('Music Story Response: ' + response);
                            resolve(result2)
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }
            else {
                reject(new Error('No token available for Music Story api call.'))
            }
        }
    )
}

requestNewToken()
    .then(
        (result) => {
            var parseString = xml2js.parseString;
            var xml = result;
            parseString(xml, function (err, result2) {
                token = result2.root.data[0].token[0];
                token_secret = result2.root.data[0].token_secret[0];
                console.log('New music story Token Returned: ' + token);
                console.log('New music story Token Secret Returned: ' + token_secret);
                console.log("")
                console.log("")
                console.log("")
            });
        }
    )
    .then(
        () => {
            apiCall(`GET`, `/artist/search`, [`name=Bob Marley`])
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    )