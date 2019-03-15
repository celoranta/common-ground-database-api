//LOOK AT https://www.terlici.com/2015/08/13/mysql-node-express.html

var mysql = require('mysql2');
var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const force = true;
//const musicStory = require('./MusicStoryAPI.class.js');

//const musicstory_consumerKey=process.env.MUSICSTORY_CONSUMER_KEY;
//const musicstory_consumerSecret=process.env.MUSICSTORY_CONSUMER_SECRET;

//let api = musicStory.musicStoryApi(musicstory_consumerKey,musicstory_consumerSecret,'','','');
//console.log(api.getToken);
var app = express();
const port = process.env.PORT;
 /* set the bodyParser to parse the urlencoded post data */
 app.use(bodyParser.urlencoded({ extended: true }))


 //https://codehandbook.org/implement-has-many-association-in-sequelize/
 //const Sequelize = require('sequelize');
const sequelize = new Sequelize('seq_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});
const models = require('./models')

models.UserTask.findAll({
    raw: true,
    attributes: [],
    include: [
      {
        model: models.Task,
        attributes: [['taskName','Task']],
      },
      {
        model: models.User,
        attributes: [['firstName','First Name'], ['lastName','Last Name']],
      }
    ]
  })
.then(function(result){
  console.log(result)
})

//MARK: Gets

app.get('/', (req, res) => {
  return res.send('Received a test GET message');
});
app.get('/PersonNameTypes', function(req, res, err)  {   
  models.PersonNameType
  .findAll()
  .then(personNameTypes => {
    console.log(personNameTypes);
    return res.send(personNameTypes)
  })
  .catch(function (error) {
    console.log(error);
  });
});

app.get('/PersonNames', (req, res) => {
  models.PersonName
  .findAll()
  .then(personName => {
    console.log(personName);
    return res.send(personName);
  })
  .catch(function (error) {
    console.log(error);
  });
});

//MARK: Puts
app.put('/PersonNameTypes/:PersonNameType', function(req, res, err)  {   
  models.PersonNameType
  .findOrCreate({where: {nameType: req.params.PersonNameType}})
  .spread((personNameType, created) => {
    console.log(personNameType.get({
      plain: true
    }))
    return res.send('Added new object.'/* + personNameType.params.NameType*/);
  })
});

app.put('/PersonNames/:PersonName/:PersonNameType', function(req, res, err) {
  models.PersonName
  .findOrCreate({where: {
    personName: req.params.PersonName
  }})
  .spread((personName, created) => {
    console.log(personName.get({
      plain: true
    }))
    return res.send('Added PersonName Object');
  })
});

//MARK: Posts
app.post('/', (req, res) => {
  return res.send('Received a test POST message');
});

 //MARK: --------------- INITIALISE THE SERVER
//init the server
app.listen(port, () => {

  console.log(`listening on port ${port}`)
})
