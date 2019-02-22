var mysql = require('mysql');
var env = require('dotenv');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',

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
 
// connection.end();