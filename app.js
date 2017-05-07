var express = require('express');
var app = express();
var swig = require('swig');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');


app.listen(3500, function() {
    console.log('Port 3500 is run');
});

app.get('/', function(req, res) {
    var data = { 'fn': 'Reza' };
    res.render('index', data);
});