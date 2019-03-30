
//Include frameworks
const fs = require('fs');
const url = require('url');
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');

var cors = require('cors');
require('dotenv').config();

//Include custom frameworks

//Assign constants
const hostname = "localhost";

//Instantiate managers
var app = express();
var httpPort = 8000;

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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/callback', (req, res) => {
  res.sendFile(callback);
  console.log(req)
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
