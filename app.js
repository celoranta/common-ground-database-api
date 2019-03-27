//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var spotifyHandler = require('./modules/spotifyHandler.js')
var db = require('./modules/pool.js');
require('./modules/databaseSetup.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))



//MARK: Define API Endpoints
//MARK: Posts

app.post('/PersonNameTypes/:personNameType', (req, res, err) => {
  console.log('received value: ' + req.params.personNameType)
  db.query(
    `INSERT INTO PersonNameTypes (personNameTypeString) ` +
    `VALUES ('` +
    req.params.personNameType
    + `');`
  )
    .then(response => {
      return res.send(response)
    })
    .catch(err)
});

app.post('/Persons', (req, res, err) => {
  console.log('received value: ' + req.params.personNameType)
  db.query(
    'INSERT INTO Persons () ' +
    'VALUES ();'
  )
    .then(response => {
      return res.send(response)
    })
    .catch(err)
});

app.post('/PersonNames/:personNameString/:personNameTypeId/:personId', (req, res, err) => {
  console.log('received Values: ' + req.params.personNameString + ", " + req.params.personNameTypeId + ", " + req.params.personId)
  db.query(
    'INSERT INTO PersonNames (personNameString, personNameTypeId, personId) '
    + `VALUES ('`
    + req.params.personNameString
    + `', '`
    + req.params.personNameTypeId
    + `', '`
    + req.params.personId
    + `');`
  )
    .then(response => {
      return res.send(response)
    })
    .catch(err)
});

//MARK: Gets

app.get('/PersonNameTypes', function (req, res, err) {
  db.query('SELECT * FROM PersonNameTypes').then(rows => {
    console.log(rows);
    return res.send(rows)
  })
    .catch(err)
});
app.get('/PersonNames', function (req, res, err) {
  db.query('SELECT * FROM PersonNames').then(rows => {
    console.log(rows);
    return res.send(rows)
  })
    .catch(err)
});
app.get('/Persons', (req, res, err) => {
  db.query('SELECT * FROM Persons')
    .then(rows => {
      console.log(rows);
      return res.send(rows)
    })
    .catch(err)
});

app.get('/PersonNamesList', (req, res, err) => {
  db.query(
    `
SELECT PersonNameTypes.PersonNameTypeString ,PersonNames.PersonNameString
FROM Persons
INNER JOIN PersonNames
ON PersonNames.PersonId=Persons.id
INNER JOIN PersonNameTypes
ON PersonNames.PersonNameTypeId=PersonNameTypes.id;
`
  )
    .then(rows => {
      console.log(rows);
      return res.send(rows)
    })
    .catch(err)
})




//MARK: Launch the Server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
});
