
// https://github.com/cornflourblue/node-role-based-authorization-api/blob/master/_helpers/authorize.js

// require('rootpath')();
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const errorHandler = require('modules/helpers/error-handler.js');
// const fs = require('fs');
// //const env = require('dotenv');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());

// // api routes
// app.use('/users', require('modules/user/user.controller.js'));

// //API User Login (Should be https?)
// app.get('/api/login', function(req, res) {
//     fs.readFile('./public/login.html', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//     });
//   })

// // global error handler
// app.use(errorHandler);

// // start server
// const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
// const server = app.listen(port, function () {
//     console.log('Server listening on port ' + port);
// });