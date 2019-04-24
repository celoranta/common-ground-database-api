const express = require('express');
const router = express.Router();
const fs = require('fs');
var appRoot = require('app-root-path');


router.get('/', (req, res) => {
res.redirect('/api/dashboard')
})
router.get('/dashboard', (req, res) => {
   // console.log(res.session)
    console.log('Launch the dashboard')
    fs.readFile(appRoot + '/private/apiDashboard.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        if(err) {
            return console.log(err)
        }
        res.write(data);
        res.end();
      });
})


module.exports = router;