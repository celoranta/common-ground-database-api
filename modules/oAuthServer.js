
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
app.use(bodyparser.urlencoded({ extended: false }))
var httpPort = process.env.OAUTH_PORT;


//This is the endpoint to create an api user, who would subsequently receive authorization
//to connect their website or app to the commonground API. 
app.post('/api/user', function (req, res, err) {
    //console.log('Put_User endpoint reached.')
    let email = req.body.email;
    const password = req.body.password;
    //const person_id = req.body.person_id
    console.log(req.body)
    try {
        db.createOauthUser(username, password, person_id)
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

app.post('/api/clients', (req, res) => {
    let clientOwnerId = req.body.client_owner_id;
    let clientName = req.body.client_name;
    let clientSecret = req.body.client_secret;
    let sql = 
    `
    INSERT INTO OauthClients (client_name, client_secret, client_owner_id)
    VALUES('` +
    clientName + `', '` +
    clientSecret + `', '` +
    clientOwnerId + `');`
    console.log(sql)
    try {
        db.pool.query(sql)
          .then((result) => { res.send(result) })
          .catch((error) => { res.send(error) })
      }
      catch (error) {
        res.send(failMsg);
      }
})

app.get('/api/user', (req, res) => {
    let sql = 
    `
SELECT OauthUsers.id, OauthUsers.password, Persons.id, PersonNameTypes.PersonNameTypeString ,PersonNames.PersonNameString ,EmailAddresses.email_address
FROM Persons
LEFT JOIN PersonNames
ON PersonNames.PersonId=Persons.id
LEFT JOIN PersonNameTypes
ON PersonNames.PersonNameTypeId=PersonNameTypes.id
LEFT JOIN EmailAddresses
ON EmailAddresses.personId=Persons.id
JOIN OauthUsers
ON OauthUsers.personId=Persons.id
;`
    try {
      db.pool.query(sql)
        .then((result) => { res.send(db.getSqlData(result)) })
        .catch((error) => { res.send(error) })
    }
    catch (error) {
      res.send(failMsg);
    }
  });

app.listen(httpPort);
console.log('Oauth server is listening on port' + httpPort);