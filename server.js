/**
 * Module dependencies.
**/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var register = require('./routes/register')
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    debug:'true',
    database:'bingo'
});
connection.connect();
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/register', register.index);
app.post('/register',function(req,res){
    var name = req.body.name;
    var pass = req.body.pass;
    var email = req.body.email;
    connection.query("INSERT INTO `users`(`name`, `email`, `password`) VALUES ('"+name+"','"+email+"','"+pass+"')",function(err,rows,fields){
        var successres={"code":2,"message":"you are successfully Registered"};
        if(err==null)
        res.end(JSON.stringify(successres));
        else if(err.code=='ER_DUP_ENTRY'){
        res.end(JSON.stringify({"code":1,"message":"selected user name already exist"}))
        }
        else{
        res.end(JSON.stringify({"code":0,"message":"We are unable to process your request"}))
        }
    });
    console.log(name,pass,email);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
