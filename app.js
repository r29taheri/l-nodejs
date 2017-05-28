var express = require('express');
var app = express();
var swig = require('swig');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3500, function() {
    console.log('Port 3500 is run');
});

//DB
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'postuser'
});
var Q = require('q');

app.use(express.static('/assets'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');


var userList = new Array();
var content = new Array();
app.get('/', function(req, res) {
    receivePost().then(function(r) {
        res.render('index', { 'content': r.reverse() })

    });
});
app.get('/register', function(req, res) {
    res.render('register', {})
})
app.post('/register', function(req, res) {
    // var data = { 'fn': 'Reza' };
    var data = {};
    if (req.body.btnReg) {
        checkUser(req.body.username).then(function(r) {
            if (r == 0) {
                reg(req.body.username, req.body.password, req.body.firstname, req.body.lastname).then(function() {
                    data['status'] = 'Register is success';
                    res.render('register', data);

                })
            } else {
                data['status'] = 'Username repetitive';
                res.render('register', data);
            }
        });
    }
})
app.get('/userlist', function(req, res) {
    if (req.query.del) {
        // console.log('Del !');
        // userList.splice(req.query.del, 1);
        deleteUser(req.query.del).then(function() {
            res.redirect('/userlist?msg=ok');
        })
    }
    // res.render('table', { 'userList': userList });
    getAllUsers().then(function(r) {
        console.log(r);
        res.render('table', { 'userList': r });

    })

});
app.get('/post', function(req, res) {
    // var data = {}
    // if (req.query.btnPost) {
    //     var post = {};
    //     post['title'] = req.query.title;
    //     post['content'] = req.query.content;
    //     content.push(post);
    // }
    // console.log(content);

    res.render('content', content);
});
app.post('/post', function(req, res) {
    var data = {}
    if (req.body.btnPost) {
        sendPost(req.body.title, req.body.content).then(function() {
            console.log(results);
            res.render('content', content);
        })
    }
    console.log(content);

    res.render('content', content);
});

function checkUser(username) {
    var deferred = Q.defer();
    var q = (`SELECT * FROM users WHERE username='${username}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.length);
    });
    return deferred.promise;
}

function reg(username, password, firstname, lastname) {
    var deferred = Q.defer();
    var q = (`INSERT INTO users(username,password,firstname,lastname) VALUES ('${username}','${password}','${firstname}','${lastname}')`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.insertId);

    });
    return deferred.promise;

}

function getAllUsers() {
    var deferred = Q.defer();
    var q = (`SELECT * FROM users`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}

function deleteUser(id) {
    var deferred = Q.defer();
    var q = (`DELETE FROM users WHERE id = '${id}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;

}
//Post:
function sendPost(title, content) {
    var deferred = Q.defer();
    var q = (`INSERT INTO posts(title,content) VALUES ('${title}','${content}')`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.insertId);

    });
    return deferred.promise;

}

function receivePost() {
    var deferred = Q.defer();
    var q = (`SELECT * FROM posts`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}
//End