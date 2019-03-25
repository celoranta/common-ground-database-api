//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//const modules = path.dirname('/modules');

app.use(bodyParser.urlencoded({ extended: true }))

var db = require('./modules/pool.js');
require('./modules/databaseSetup.js');

//MARK: Define API Endpoints

//MARK: Puts
// app.put('/PersonNameTypes/:NameType', function (req, res, err) {
//   // PersonNameType
//   // .findOrCreate({where: {NameType: req.params.NameType}})
//   // .spread((personNameType, created) => {
//   //   console.log(personNameType.get({
//   //     plain: true
//   //   }))
//   //   return res.send('Added new object.'/* + personNameType.params.NameType*/);
//   // })
// });
// app.put('/Persons', function(req, res, err) {   
//   Person
//   .findOrCreate({where: {bufferValue: 1}})
//   .spread((person, created) => {
//     console.log(person.get({
//       plain: true
//     }))
//     return res.send('Added Person Object');
//   })
// });
// app.put('/PersonNames/:PersonName/:Person', function(req, res, err) {
//   PersonName
//   .findOrCreate({where: {
//     //PersonNameType: req.params.PersonNameType,
//     //PersonId: req.params.Person,
//     PersonName: req.params.PersonName
//   }})
//   .spread((personName, created) => {
//     console.log(personName.get({
//       plain: true
//     }))
//     return res.send('Added PersonName Object');
//   })
// });

//MARK: Posts

app.post('/PersonNameTypes/:personNameType', (req, res) => {
  console.log('received value: ' + req.params.personNameType)
  db.query(
    `INSERT INTO PersonNameTypes (personNameTypeString) ` +
    `VALUES ('` +
    req.params.personNameType
    + `');`
  )
    .then(response => {
    })
  return res.send(
  )
});

app.post('/Persons', (req, res) => {
  console.log('received value: ' + req.params.personNameType)
  db.query(
    'INSERT INTO Persons () ' +
    'VALUES ();'
  )
  .then(response => {

  })
  return res.send(
  )
});

app.post('/PersonNames/:personNameString/:personNameTypeId/:personId', (req, res) => {
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

  })
  return res.send(
  )
});

//MARK: Gets

// app.get('/', (req, res) => {
//   return res.send('Received a test GET message');
// });
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
app.get('/Persons', (req, res) => {
  db.query('SELECT * FROM Persons')
    .then(rows => {
      console.log(rows);
      return res.send(rows)
    })
    .catch(res.err)
});
// });
// app.get('/PersonNames', (req, res) => {
//   PersonName.findAll()
//   .then(personName => {
//     console.log(personName);
//     return res.send(personName);
//   });
// });

//MARK: Deletes
// app.delete('/', (req, res) => {

//   return res.send('Received a test DELETE message');
// });
// app.delete('/Persons/:PersonID', (req, res) => {   
//   return res.send('DELETE method for Person ' + req.params.PersonID + ' objects');
// });

//MARK: Launch the Server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
