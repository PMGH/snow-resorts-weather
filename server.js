var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client/build'));
// app.use(require('./controllers/index'));

MongoClient.connect('mongodb://localhost:27017/snow_resorts', function(err, client){
  if (err){ return console.log(err); }
  db = client.db('snow_resorts');
  console.log('Connected to DB');
  app.listen(3000, function(){
    console.log('App listening on ' + this.address().port);
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/build/index.html');
});

app.get('/regions', function(req, res){
  db.collection("regions").find().toArray(function(err, results){
    if(err){ return console.log(err); }
    res.json(results);
  });
});

app.get('/resorts', function(req, res){
  db.collection("resorts").find().toArray(function(err, results){
    if(err){ return console.log(err); }
    res.json(results);
  });
});

app.get('/resorts/:resort', function(req, res){
  var resort = { 'SkiArea.name': { $eq: req.params.resort } }
  db.collection("resorts").find(resort).toArray(function(err, results){
    if(err){ return console.log(err); }
    res.json(results);
  });
});

app.get('/resortsByRegion/:region', function(req, res){
  var resort = { 'Region.0.name': { $eq: req.params.region } }
  db.collection('resorts').find(resort).toArray(function(err, results){
    if(err){ return console.log(err); }
    res.json(results);
  });
});
