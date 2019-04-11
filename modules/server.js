
//Include frameworks
const fs = require('fs');
const url = require('url');
var express = require('express'),
    app = express(),
    session = require('express-session');
const path = require('path');
const bodyparser = require('body-parser');
let bcrypt = require('bcrypt');
const db = require('./pool.js');
var cors = require('cors');
require('dotenv').config();
let spotifyUserHandler = require('./spotifyUserHandler.js')
let saltrounds = 10;


/*------------------------------------------------------*/

//https://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/


app.use(session({
    secret: process.env.API_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
 
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.role === "user" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
 
// Login endpoint
// app.get('/login', function (req, res) {
//   if (!req.query.username || !req.query.password) {
//     res.send('login failed');    
//   } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
//     req.session.user = "amy";
//     req.session.admin = true;
//     res.send("login success!");
//   }
// });
 
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});

/*--------------------------------------------------- */

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
//var app = express();
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
//var callback = path.join(__dirname + '/public/callback.html');

//Static Routes
app.use(express.static(publicFolder));

//Tell express to use body parser and not parse extended bodies directly
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/spotifyLogin', function(req, res) {
  console.log('State Value: ' + stateValue)
  var scopes = 'user-read-private user-read-email';
  console.log('login attempted')
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOTIFY_APP_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.OAUTH_CALLBACK))  +
    '&state=' + encodeURIComponent(stateValue);
  });

app.get('/spotifyCallback', (req, res, err) => {
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
//Temp redirect to band site
  res.redirect(process.env.BANDSITE);
});

//API User Login (Should be https?)
app.get('/api/login', function(req, res) {
  fs.readFile('./public/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})

app.post('/api/login', function(req, res) {
  //let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  console.log('Endpoint received: ' + password + "; " + username)
  let sql = `
  SELECT api_username, email_address, Persons.id AS personId, OauthUsers.password AS hash
  FROM EmailAddresses
  LEFT JOIN Persons ON EmailAddresses.personId=Persons.id
  LEFT JOIN OauthUsers ON Persons.id=OauthUsers.personId
  WHERE api_username='` + username + `';
  `
  try {
  db.pool.query(sql)
  .then((result) => {
    let userData = result[0][0];
    let hash = userData.hash
   console.log('User Data: ' + JSON.stringify(userData))
    //let email_address = userData.email_address;
    let userId = userData.id;
    bcrypt.compare(password, hash).then(function(passRes) {
      if(passRes){
        req.session.user = userId;
        req.session.role = "user";
        res.send('Login Successful')
      }
      else(
        res.send('Access Denied.')
      )
  })
  .catch((error) => {res.send('Access Denied. ' + error)})
})
  .catch((error) => {res.send('Access Denied. ' + error)})
  }
  catch(error){
    console.log('Login Error')
    res.send(error)
  }
})

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(httpPort);
console.log('html server is listening on port ' + httpPort);
