//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const force = true;
const musicStory = require('MusicStoryAPI.class.js');

const musicstory_consumerKey=process.env.MUSICSTORY_CONSUMER_KEY;
const musicstory_consumerSecret=process.env.MUSICSTORY_CONSUMER_SECRET;

var app = express();
const port = process.env.PORT;
 /* set the bodyParser to parse the urlencoded post data */
 app.use(bodyParser.urlencoded({ extended: true }))

 //Create Database
var connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.DB_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});
connection.connect();

//  connection.query(
//   `
//   CREATE DATABASE IF NOT EXISTS commonground;
//   `
//   )  , function (error, results, fields) {
//     if (error) throw error;
//   };
// connection.end();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.DB_USER, process.env.MYSQL_PASSWORD , {
  host: process.env.HOST,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//Model Definition
const PersonNameType = sequelize.define('PersonNameType', {
  nameType: {
    type: Sequelize.STRING, allowNull: false
  }
});
const Person = sequelize.define('Person', {
    bufferValue: {
      type: Sequelize.TINYINT(1)
    }
  }
);
const PersonName = sequelize.define('PersonName', {
    personName: {
      type: Sequelize.STRING,
      allowNull: false
    }
    // ,
    // personId: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'people',
    //     key: 'id'
    //   }
    // }
  }
);

Person.hasMany(PersonName);

//Person.hasMany(PersonName);
//PersonName.hasOne(PersonNameType);


PersonNameType.sync({force: force})
.then(() => {
  // Table created
  // return User.create({
  //   firstName: 'John',
  //   lastName: 'Hancock'
  // });
});

PersonName.sync({force: force})
.then(() => {
});

Person.sync({force: force})
.then(() => {
});

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS EmailAddresses (
// EmailAddressID Int NOT NULL AUTO_INCREMENT,
// EmailAddress varchar(255),
// PersonID Int NOT NULL,
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (EmailAddressID),
// FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Acts (
// ActID Int NOT NULL AUTO_INCREMENT,
// ActName varchar(255),
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (ActID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Clearances (
// ClearanceID Int NOT NULL AUTO_INCREMENT,
// ClearanceName varchar(255),
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (ClearanceID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Memberships (
// MembershipID Int NOT NULL AUTO_INCREMENT,
// PersonID Int NOT NULL,
// ActID Int NOT NULL,
// ClearanceID Int NOT NULL,
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (MembershipID),
// FOREIGN KEY (PersonID) REFERENCES Persons(PersonID),
// FOREIGN KEY (ActID) REFERENCES Acts(ActID),
// FOREIGN KEY (ClearanceID) REFERENCES Clearances(ClearanceID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS BandContactInfo (
// ID int NOT NULL AUTO_INCREMENT,
// CityName varchar(255),
// StateOrProvince varChar(255),
// PhoneNumber varChar(255),
// EmailAddress varChar(255),
// PRIMARY KEY (ID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };
 
// connection.end();

//MARK: Define API Endpoints

//MARK: Gets

app.get('/', (req, res) => {
  return res.send('Received a test GET message');
});
app.get('/PersonNameTypes', function(req, res, err)  {   
  PersonNameType.findAll()
  .then(personNameTypes => {
    console.log(personNameTypes);
    return res.send(personNameTypes);
  });
});
app.get('/Persons', (req, res) => {
  Person.findAll()
  .then(person => {
    console.log(person);
    return res.send(person);
  });
});
app.get('/PersonNames', (req, res) => {
  PersonName.findAll()
  .then(personName => {
    console.log(personName);
    return res.send(personName);
  });
});

//MARK: Puts
app.put('/', (req, res) => {
  return res.send('Received a test PUT message');
});
app.put('/PersonNameTypes/:NameType', function(req, res, err)  {   
  PersonNameType
  .findOrCreate({where: {NameType: req.params.NameType}})
  .spread((personNameType, created) => {
    console.log(personNameType.get({
      plain: true
    }))
    return res.send('Added new object.'/* + personNameType.params.NameType*/);
  })
});
app.put('/Persons', function(req, res, err) {   
  Person
  .findOrCreate({where: {bufferValue: 1}})
  .spread((person, created) => {
    console.log(person.get({
      plain: true
    }))
    return res.send('Added Person Object');
  })
});
app.put('/PersonNames/:PersonName/:Person', function(req, res, err) {
  PersonName
  .findOrCreate({where: {
    //PersonNameType: req.params.PersonNameType,
    //PersonId: req.params.Person,
    PersonName: req.params.PersonName
  }})
  .spread((personName, created) => {
    console.log(personName.get({
      plain: true
    }))
    return res.send('Added PersonName Object');
  })
});


//MARK: Posts
app.post('/', (req, res) => {
  
  return res.send('Received a test POST message');
});
app.post('/Persons', (req, res) => {   
  return res.send('POST method for Persons object'
  )
});


//MARK: Deletes
app.delete('/', (req, res) => {
  
  return res.send('Received a test DELETE message');
});
app.delete('/Persons/:PersonID', (req, res) => {   
  return res.send('DELETE method for Person ' + req.params.PersonID + ' objects');
});


 //MARK: --------------- INITIALISE THE SERVER
//init the server
app.listen(port, () => {

  console.log(`listening on port ${port}`)
})
