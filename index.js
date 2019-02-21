var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  //Will need to change this to env variable soon
  password : '$1G2lM4@',
  database : 'commonground'
});
 
connection.connect();
 
connection.query(
`
CREATE TABLE IF NOT EXISTS BandContactInfo (
ID int NOT NULL AUTO_INCREMENT,
ContactRecordId int,
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
 
connection.end();