var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '$1G2lM4@',
  database : 'commonground'
});
 
connection.connect();
 
connection.query(
`
SELECT * FROM *
`
)  , function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
};
 
connection.end();