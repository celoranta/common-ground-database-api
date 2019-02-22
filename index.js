var mysql = require('mysql');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

//https://blog.cloudboost.io/how-to-make-an-oauth-2-server-with-node-js-a6db02dc2ce7

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
  console.log('The solution is: ', results[0].solution);
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
app.listen(port, () => {

  console.log(`listening on port ${port}`)
})

