var mysql = require('mysql');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');


var app = express();
const port = process.env.PORT;
 /* set the bodyParser to parse the urlencoded post data */
 app.use(bodyParser.urlencoded({ extended: true }))

//Test Database
 var connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.DB_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});
connection.connect();

connection.query(
  `
  CREATE DATABASE IF NOT EXISTS commonground;
  `
  )  , function (error, results, fields) {
    if (error) throw error;
  };

connection.query(
  `
  CREATE TABLE IF NOT EXISTS PersonNameTypes (
  PersonNameTypeID int NOT NULL AUTO_INCREMENT,
  NameType varchar(255) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (PersonNameTypeID)
  );
  `
  )  , function (error, results, fields) {
    if (error) throw error;
  };

connection.query(
  `
  CREATE TABLE IF NOT EXISTS Persons (
  PersonID int NOT NULL AUTO_INCREMENT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (PersonID)
  );
  `
  )  , function (error, results, fields) {
    if (error) throw error;
  };

connection.query(
`
CREATE TABLE IF NOT EXISTS PersonNames (
PersonNameID int NOT NULL AUTO_INCREMENT,
CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PersonNameType Int NOT NULL,
PersonNameString varchar(255) NOT NULL,
PersonID Int NOT NULL,
PRIMARY KEY (PersonNameID),
FOREIGN KEY (PersonNameType) REFERENCES PersonNameTypes(PersonNameTypeID),
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

connection.query(
`
CREATE TABLE IF NOT EXISTS EmailAddresses (
EmailAddressID Int NOT NULL AUTO_INCREMENT,
EmailAddress varchar(255),
PersonID Int NOT NULL,
CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (EmailAddressID),
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

connection.query(
`
CREATE TABLE IF NOT EXISTS Acts (
ActID Int NOT NULL AUTO_INCREMENT,
ActName varchar(255),
CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (ActID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

connection.query(
`
CREATE TABLE IF NOT EXISTS Clearances (
ClearanceID Int NOT NULL AUTO_INCREMENT,
ClearanceName varchar(255),
CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (ClearanceID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

connection.query(
`
CREATE TABLE IF NOT EXISTS Memberships (
MembershipID Int NOT NULL AUTO_INCREMENT,
PersonID Int NOT NULL,
ActID Int NOT NULL,
ClearanceID Int NOT NULL,
CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (MembershipID),
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID),
FOREIGN KEY (ActID) REFERENCES Acts(ActID),
FOREIGN KEY (ClearanceID) REFERENCES Clearances(ClearanceID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

connection.query(
`
CREATE TABLE IF NOT EXISTS BandContactInfo (
ID int NOT NULL AUTO_INCREMENT,
CityName varchar(255),
StateOrProvince varChar(255),
PhoneNumber varChar(255),
EmailAddress varChar(255),
PRIMARY KEY (ID)
);
`
)  , function (error, results, fields) {
  if (error) throw error;
};

// connection.query(
//   `
//   INSERT INTO BandContactInfo (CityName, StateOrProvince, PhoneNumber, EmailAddress)
//   VALUES(
//     'Vancouver',
//     'BC',
//     '+1 604-657-5677',
//     'info@commongroundband.ca'
//    );
//   `
//   )  , function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   };
 
connection.end();


 //MARK: --------------- INITIALISE THE SERVER

//init the server
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

app.get('/Persons', function(req, res, next) {   
  //now you can call the get-driver, passing a callback function
  getDriver(function (err, driverResult){ 
     //you might want to do something is err is not null...      
     res.render('SQLtest', { 'title': 'SQL test',
                      'result': driverResult});

  });
});



// app.get('/persons', (req, res) => {
//   var connection = mysql.createConnection({
//     host     : process.env.HOST,
//     user     : process.env.DB_USER,
//     password : process.env.MYSQL_PASSWORD,
//     database : process.env.MYSQL_DATABASE
//   });
//   connection.connect();
//    connection.query(
//     `
//     SELECT * FROM Persons;
//     `
//     )  , function (error, results, fields) {
//       if (error) throw error;
//       return res.send(results)
//     };
//     connection.end();
// });

app.listen(port, () => {

  console.log(`listening on port ${port}`)
})


function getDriver(callback) {    
  connection.query("SELECT * FROM Persons",
      function (err, rows) {
          //here we return the results of the query
          callback(err, rows); 
      }
  );    
}

