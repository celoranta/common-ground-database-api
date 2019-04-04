
//Include frameworks
const fs = require('fs');
const url = require('url');
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
let spotifyUserHandler = require('./spotifyUserHandler.js')

//Include custom frameworks

//Assign constants
const hostname = process.env.HOST;

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

//Instantiate managers
var app = express();
var httpPort = 8000;
const stateValue = create_UUID();

app.use(cors());

app.options('*', cors())
var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Create filepaths
var publicFolder = path.join(__dirname + '/public');
var callback = path.join(__dirname + '/public/callback.html');

//Static Routes
app.use(express.static(publicFolder));

//Tell express to use body parser and not parse extended bodies directly
app.use(bodyparser.urlencoded({ extended: true }));

//Custom Routing functions
// function setCorsHeaders(res) {
// res.header("Access-Control-Allow-Origin", '*');
// res.header("Access-Control-Allow-Credentials", true);
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
// return res;
// }

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/login', function(req, res) {
  console.log(stateValue)
  var scopes = 'user-read-private user-read-email';
  console.log('login attempted')
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOTIFY_APP_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.OAUTH_CALLBACK))  +
    '&state=' + encodeURIComponent(stateValue);
  });

app.get('/callback', (req, res, err) => {
  var code = null;
  let codeObject = req.query;
  if (codeObject.hasOwnProperty("code")){
    code = codeObject.code;    
    spotifyUserHandler.tokenRequest(code);
  }
else if(codeObject.hasOwnProperty("error") ){
     let codeObjError = new Error(codeObject.error)
}
else{
   let unknown = new Error('Oauth server response returned neither code nor error.')
}
  res.redirect(process.env.BANDSITE);
});


// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(httpPort);
console.log('html server is listening on port 8000');
