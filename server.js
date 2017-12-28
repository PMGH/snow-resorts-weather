var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client/build'));
// app.use(require('./controllers/index'));

app.listen(3000, function(){
  console.log('App listening on ' + this.address().port);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/build/index.html');
});
