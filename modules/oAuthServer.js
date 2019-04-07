
//Include frameworks
//const fs = require('fs');
//const url = require('url');
const express = require('express');
//const path = require('path');
const bodyparser = require('body-parser');
//var cors = require('cors');
require('dotenv').config();

let db = require('./pool.js');

//Assign constants
const hostname = process.env.HOST;


//Instantiate managers
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
var httpPort = process.env.OAUTH_PORT;


app.post('/api/user', function (req, res, err) {
    //console.log('Put_User endpoint reached.')
    let username = req.body.username;
    const password = req.body.password;
    //console.log(body)
    try {
        db.createOauthUser(username, password)
            .then((result) => {
                if (result.errno) {
                    var errMsg = 'Unknown SQL Error'
                    switch (result.errno) {
                        case 1062:
                            errMsg = 'Username is not Available.'
                            break;
                        default:
                        //No default
                    }
                    console.log(errMsg)
                    res.send(errMsg)
                }
                else {
                    res.send(result)
                }
            })
    } catch (error) {
    };
});

app.listen(httpPort);
console.log('Oauth server is listening on port' + httpPort);