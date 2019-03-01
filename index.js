//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');

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

  const PersonNameTypes = sequelize.define('PersonNameTypes', {
    NameType: {
      type: Sequelize.STRING
    },
  });
  
  // force: true will drop the table if it already exists
  PersonNameTypes.sync({force: true}).then(() => {
    // Table created
    // return User.create({
    //   firstName: 'John',
    //   lastName: 'Hancock'
    // });
  });



// connection.query(
//   `
//   CREATE TABLE IF NOT EXISTS PersonNameTypes (
//   PersonNameTypeID int NOT NULL AUTO_INCREMENT,
//   NameType varchar(255) NOT NULL,
//   CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (PersonNameTypeID)
//   );
//   `
//   )  , function (error, results, fields) {
//     if (error) throw error;
//   };

// connection.query(
//   `
//   CREATE TABLE IF NOT EXISTS Persons (
//   PersonID int NOT NULL AUTO_INCREMENT,
//   CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (PersonID)
//   );
//   `
//   )  , function (error, results, fields) {
//     if (error) throw error;
//   };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS PersonNames (
// PersonNameID int NOT NULL AUTO_INCREMENT,
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PersonNameType Int NOT NULL,
// PersonNameString varchar(255) NOT NULL,
// PersonID Int NOT NULL,
// PRIMARY KEY (PersonNameID),
// FOREIGN KEY (PersonNameType) REFERENCES PersonNameTypes(PersonNameTypeID),
// FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

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

app.get('/', (req, res) => {
  
  return res.send('Received a GET message');
});

app.post('/', (req, res) => {
  
  return res.send('Received a POST message');
});

app.put('/', (req, res) => {
  
  return res.send('Received a PUT message');
});

app.delete('/', (req, res) => {
  
  return res.send('Received a DELETE message');
});

app.get('/PersonNameTypes', function(req, res, err)  {   
  PersonNameTypes.findAll()
  .then(personNameTypes => {
    console.log(personNameTypes);
  }

  );
});

app.post('/Persons', (req, res) => {   
  return res.send('POST method for Persons object'
  )
});

app.put('/Persons/:PersonID', (req, res) => {   
  return res.send('PUT method for Person '+ req.params.PersonID +' object');
});

app.delete('/Persons/:PersonID', (req, res) => {   
  return res.send('DELETE method for Person ' + req.params.PersonID + ' objects');
});

 //MARK: --------------- INITIALISE THE SERVER

//init the server

app.listen(port, () => {

  console.log(`listening on port ${port}`)
})



//MARK: Helper Functions

// async function allPersons() {
//   var connection = getConnectedDb();
//   var uresults;
//   await connection.query("SELECT * FROM Persons;")
//    , function (error, results, fields) {
//     if (error) throw error;
//     uresults = results
//   };
//     connection.end();
//     console.log(uresults);
//   return uresults;
// }




