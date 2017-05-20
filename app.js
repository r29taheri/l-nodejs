var express = require('express');
var app = express();
var swig = require('swig');

app.listen(3500, function() {
    console.log('Port 3500 is run');
});

app.use(express.static('/assets'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');


var userList = new Array();

app.get('/', function(req, res) {
    // var data = { 'fn': 'Reza' };
    var data = {};
    if (req.query.btnReg) {
        var reg = {};
        reg['username'] = req.query.username;
        reg['password'] = req.query.password;
        reg['firstname'] = req.query.firstname;
        reg['lastname'] = req.query.lastname;

        var regShow = { 'username': reg['username'], 'data': reg };
        var isUserAlready = true;
        for (var index in userList) {
            var username = userList[index]['username'];
            if (username == reg['username']) {
                isUserAlready = false;
                break;
            }
        }
        if (isUserAlready) {
            userList.push(regShow);
            data['status'] = 'register is success';
        } else {
            data['status'] = 'register is not success';

        }
        console.log(userList);

    }
    res.render('index', data);
});
app.get('/userlist', function(req, res) {
    if (req.query.del) {
        console.log('Del !');
        userList.splice(req.query.del, 1);
        res.redirect('/userlist?msg=ok');
    } else
        res.render('table', { 'userList': userList });
});