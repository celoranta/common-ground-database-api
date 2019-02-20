var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '$1G2lM4@',
  database : 'commonground'
});
 
connection.connect();
 
connection.query('CREATE TABLE IF NOT EXISTS tasks (' +
  'task_id INT AUTO_INCREMENT,' +
  'title VARCHAR(255) NOT NULL,' +
  'start_date DATE,' +
  'due_date DATE, ' +
  'status TINYINT NOT NULL,'+
  'priority TINYINT NOT NULL,'+
  'description TEXT,'+
  'PRIMARY KEY (task_id);'
)  , function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
};
 
connection.end();