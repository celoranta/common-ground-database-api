//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('promise-mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
// var path = require('path');


var spotifyHandler = require('./modules/spotifyHandler.js')
var db = require('./modules/pool.js');
require('./modules/databaseSetup.js');
require('./modules/server.js');
require('./modules/oAuthServer.js');

//var musicStory = require('./modules/musicStoryHandler.js')

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))


//MARK: Define API Endpoints
//MARK: Posts

const failMsg = 'Database Query Failed.'

app.post('/PersonNameTypes/:personNameType', (req, res) => {
  console.log('received value: ' + req.params.personNameType)
  let sql =
    `INSERT INTO PersonNameTypes (personNameTypeString) ` +
    `VALUES ('` +
    req.params.personNameType
    + `');`
  try {
    db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg)
  }
})

app.post('/Persons', (req, res) => {
  let sql =
    'INSERT INTO Persons () ' +
    'VALUES ();'
  try {
    db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg)
  }
});

app.post('/PersonNames/:personNameString/:personNameTypeId/:personId', (req, res) => {
  let sql =
    'INSERT INTO PersonNames (personNameString, personNameTypeId, personId) '
    + `VALUES ('`
    + req.params.personNameString
    + `', '`
    + req.params.personNameTypeId
    + `', '`
    + req.params.personId
    + `');`
  try {
    db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg)
  }
});

//MARK: Gets
app.get('/PersonNameTypes', function (req, res) {
  let sql = 'SELECT * FROM PersonNameTypes'
  try {
    db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg);
  }
});

app.get('/PersonNames', function (req, res) {
  let sql = 'SELECT * FROM PersonNames'
  try {
    let rows = db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg);
  }
});

app.get('/Persons', (req, res) => {
  let sql = 'SELECT * FROM Persons'
  try {
    db.pool.query(sql)
      .then((result) => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg);
  }
});

app.get('/PersonNamesList', (req, res) => {
  let sql =
    `
SELECT Persons.id, PersonNameTypes.PersonNameTypeString ,PersonNames.PersonNameString
FROM Persons
INNER JOIN PersonNames
ON PersonNames.PersonId=Persons.id
INNER JOIN PersonNameTypes
ON PersonNames.PersonNameTypeId=PersonNameTypes.id
;

`
  try {
    db.pool.query(sql)
      .then(result => { res.send(result) })
      .catch((error) => { res.send(error) })
  }
  catch (error) {
    res.send(failMsg);
  }
});


//Spotify API Calls
app.get('/SpotifySearchTest/:query/:type', function (req, res, err) {
  let searchPromise = spotifyHandler.search(req.params.query, req.params.type)
  searchPromise
    .then((rows) => {
      console.log("Search Results: " + rows);
      return res.send(rows)
    })
    .catch(err)
});

app.get('/SpotifyAnalyzeTrackId/:trackId', function (req, res, err) {
  let analyzePromise = spotifyHandler.analyze(req.params.trackId)
  analyzePromise
    .then((rows) => {
      console.log("Analysis Results: " + rows);
      return res.send(rows)
    })
    .catch(err)
});

//Spotify User Authorization 
app.get('/login', function (req, res) {
  var scopes = 'user-read-private user-read-email';
  var redirect_uri = 'localhost:8000/callback'
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOTIFY_APP_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/SpotifyUserAuthCallback/:code/:state', function (req, res) {
  console.log(req.params.code);
  console.log(req.params.state)
})
//MARK: Launch the Server
app.listen(process.env.PORT, () => {
  console.log(`API server is listening on port ${process.env.PORT}`)
});
