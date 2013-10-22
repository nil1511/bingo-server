/**
 * Module dependencies.
**/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bingo'
});
connection.connect();
//var app = express();
//var io = require('socket.io').listen(app);
var app = express()
    ,http = require('http')
    ,server = http.createServer(app)
    ,io = require('socket.io').listen(server);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('hXZe!l*loserce%'));
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
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
app.post('/checkusername',function(req,res){
    var name = req.body.name;
    connection.query("SELECT `name` FROM `users` WHERE `name`='"+name+"'",function(err,rows,fields){
        console.log(err,rows,fields);
        res.end(rows.length.toString());
    })
})
app.post('/login',function(req,res){
    var name = req.body.name;
    var pass = req.body.password;
    connection.query("SELECT `id` FROM `users` WHERE `name`='"+name+"' AND `password`='"+pass+"'",function(err,rows,fields){
        if(rows.length==0){
            res.end('0');
            return;
        }
        req.session.user_id=rows[0].id;
        console.log(err,rows,fields,req.session,req);
        res.end(rows.length.toString());
    })
})
function checksession(req,res,next){
    if(req.session.user_id||true)
        next();
    else{
        res.render('index', { title: 'Bingo',page:'index' });
    }
}
app.get('/bingo',checksession,routes.bingo);
//http.createServer(app).listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
//});

var num=0;
var updatetimeStamp=new Date();
var seed=true;
var ttu=5;//time to update
var numobj={};
var seeder;
io.sockets.on('connection',function(socket){
    if(seed){
    seed=false;
    seeder= setInterval(ne,ttu*1000);
    console.log("Created Timer");
    }
   function ne(){
    var min=1,max=100;
    if(num==0||(updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu==0){
        updatetimeStamp=new Date();
        if(num==0)
        var b = num;
        num = Math.floor(Math.random()*max+min);
        if(typeof b!= 'undefined'&& b==0){
            numobj[num]=1
        }
        while(numobj[num]==1)
        {
            console.log(num,numobj);
           num = Math.floor(Math.random()*max+min);
        }
        numobj[num]=1;
        socket.emit('no', { code: num });
        console.log((updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu,updatetimeStamp.getSeconds(),new Date().getSeconds());
    }
    socket.broadcast.emit('no', { code: num });
   }
    console.log("welcome",Object.keys(io.connected).length,numobj)
    socket.on('disconnect',socketdisconnect);
})
function socketdisconnect(s){
    var a=io.sockets.clients();
    //io.sockets.emit(a);
    if(Object.keys(io.connected).length==1){
        clearInterval(seeder);
        seed= true;
        num=0;
        console.log("Cleared Interval");
    }
    console.log("disconnected",Object.keys(io.connected).length,numobj);
}
server.listen(3000);
