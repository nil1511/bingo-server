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
//var db = new ApplicationDB('paulo.mongohq.com',10099,'nodejitsu','dfe4b2c329cc079231ce74c7237f615a','nodejitsudb8322450453')
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
var numlist=[];
var seeder;
io.sockets.on('connection',function(socket){
    if(seed){
    seed=false;
    prepareNumlist();
    seeder= setInterval(ne,ttu*1000);
    console.log("Created Timer");
    }
    function ne(){
    var min=1,max=numlist.length;
    //console.log("Inside function ne",updatetimeStamp.getSeconds(),new Date().getSeconds(),(updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu);
    //if((updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu==0){
        //updatetimeStamp=new Date();
        if(numlist.length==0){
            console.log("Game over");
            num=99;
            io.sockets.emit('game',{status:"game_over"});
            seed=true;
            clearInterval(seeder);
            return;
        }
        var ran = Math.floor(Math.random()*max+min)-1;
        num = numlist[ran];
        //console.log(num,ran,numlist);
        numlist.splice(ran,1);
        io.sockets.emit('no', { code: num });
        //console.log((updatetimeStamp.getSeconds()-new Date().getSeconds())%ttu,updatetimeStamp.getSeconds(),new Date().getSeconds());
        //}
    }
    socket.emit('no', { code: num });
    console.log("welcome",Object.keys(io.connected).length)
    socket.on('disconnect',socketdisconnect);
    socket.on('clam',function(socket){
        claming(socket);
    })
})
function prepareNumlist(){
    for(var i=1;i<=100;i++){
        numlist[i-1]=i;
    }
    return;
}
io.set('authorization',function(data,accept){
    console.log(data,accept);
    accept(null,true);
})
function socketdisconnect(){
    var a=io.sockets.clients();
    if(Object.keys(io.connected).length==1){
        clearInterval(seeder);
        seed= true;
        console.log("Cleared Interval");
    }
    console.log("disconnected",Object.keys(io.connected).length,numlist);
}
function claming(s) {
    console.log(s);
}
server.listen(3000);
