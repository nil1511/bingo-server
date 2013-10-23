/**
 * Module dependencies.
**/

var express = require('express');
var routes = require('./routes');
var users= require('./modules/users');
var http = require('http');
var path = require('path');
var ApplicationDB = require('./modules/db').ApplicationDB;
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
var db = new ApplicationDB('localhost',27017,'','','bingo')
app.get('/', routes.index);
app.post('/register',function(req,res){
    var name = req.body.name;
    var pass = req.body.pass;
    var email = req.body.email;
    db.save({"name":name,"password":pass,"email":email},function(err,doc){
        var successres={"code":2,"message":"you are successfully Registered"};
       if(err){
        res.end(JSON.stringify({"code":1,"message":"selected user name already exist"}))
        console.log(err);
        }
        else{
        res.end(JSON.stringify(successres));
        }
    });
    console.log(name,pass,email);
});
app.post('/checkusername',function(req,res){
    var name = req.body.name;
    db.findOne({"name":name},function(err,result){
        console.log(err,result);
        if(result==null)
            res.end('0');
        else
            res.end('1')
    })
})
app.post('/login',function(req,res){
    var name = req.body.name;
    var pass = req.body.password;
    db.findOne({"name":name,"password":pass},function(err,result){
        console.log(err,result);
        if(result==null){
            res.end('0');
        }
        else{
            req.session.user_id=result._id;
            res.end('1')
        }
    })
})
function checksession(req,res,next){
    if(req.session.user_id){
        users.AddUser(req.session.user_id);
        next();
        console.log('Inside checksession');
    }
    else{
        res.render('index', { title: 'Bingo',page:'index' });
    }
}
app.get('/bingo',checksession,routes.bingo);

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
    if(num==0||(updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu==0) {
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
    socket.emit('no', { code: num });
    console.log("welcome",Object.keys(io.connected).length,numobj)
    socket.on('disconnect',socketdisconnect);
    socket.on('clam',function(socket){
        claming(socket);
    })
})
io.set('authorization',function(data,accept){
    console.log(data,accept);
    accept(null,true);
})
function socketdisconnect(){
    var a=io.sockets.clients();
    if(Object.keys(io.connected).length==1){
        clearInterval(seeder);
        seed= true;
        num=0;
        console.log("Cleared Interval");
    }
    console.log("disconnected",Object.keys(io.connected).length,numobj);
}
function claming(s) {
    console.log(s);
}
server.listen(3000);
