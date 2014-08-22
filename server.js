/**
 * Module dependencies.
**/

var express = require('express');
var routes = require('./routes');
var users= require('./modules/users');
var http = require('http');
var path = require('path');
var DB = require('./modules/db'),
    ApplicationDB = DB.ApplicationDB;
var cookieParser=express.cookieParser('hXZe!l*loserce%');
var connect = require('connect'),
    sessionStore = new connect.middleware.session.MemoryStore();
var app = express()
    ,http = require('http')
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({store: sessionStore}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app)
    ,io = require('socket.io').listen(server)
    ,SessionSockets = require('session.socket.io')
    ,sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

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
    //console.log(name,pass,email);
});
app.post('/checkusername',function(req,res){
    var name = req.body.name;
    db.findOne({"name":name},function(err,result){
        //console.log(err,result);
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
        //console.log(err,result);
        if(result==null){
            res.end('0');
        }
        else{
            console.log("Writing header");
            req.session.user_id=result._id;
            var name=result.name;
            if(users.notExist(req.session.user_id))
                users.AddUser(req.session.user_id,name);
            res.end('1');
        }
    })
});
app.get('/logout',function(req,res){
    console.log("Logingout");
    req.session.destroy()
    res.redirect('/');
})
function checksession(req,res,next){
    if(req.session.user_id){
        console.log('Inside checksession');
        next();
    }
    else{
        res.render('index', { title: 'Bingo',page:'index' });
    }
}
app.get('/bingo',checksession,function(req,res){
    routes.bingo(req,res,round)
});
app.get('/how',routes.how);

var maximum =100;
var StartTime =new Date(2013,9,27,22,00,0,0);
var sentNums = [];
var num=Math.floor(Math.random()*maximum+1);
var updatetimeStamp=new Date();
var seed=true;
var ttu=6;//time to update
var numlist=[];
var seeder;
var winner  = {};
var round=0;
var uh,fh,lh;
var gamerunning= true;
function ne(){
    if(seed)
        return;
    if(gamerunning){
        var min=1,max=numlist.length;
        if(numlist.length==0 || Object.keys(winner).length==3){
            console.log("Game over");
            io.sockets.emit('game',{status:"game_over"});
            //console.log(numlist,sentNums);
            clearInterval(seeder);
            return;
        }
        var ran = Math.floor(Math.random()*max+min)-1;
        num = numlist[ran];
        numlist.splice(ran,1);
        sentNums.push(num);
        console.log(sentNums.length);
        io.sockets.emit('no', { code: num });
    }
}
function resultDecleared(){
    seed=true;
    round++;
    users.clearCard();
    StartTime =new Date(new Date().getTime()+(1*60*1000));
    gamerunning=false;
    io.sockets.emit('newgame');
}
sessionSockets.on('connection',function(err,socket,session){
    //console.log(StartTime,new Date()> StartTime);
    //console.log("Printing session");
    console.log("Number of Users Online "+Object.keys(io.connected).length);
    if(typeof session=="undefined"){
        console.log("Session Undefined");
        //users.listuser();
        return;
    }
    if(new Date()<StartTime){
        socket.emit('starttime',{time:StartTime,stime:new Date()});
    }else{
         //if(users.getNum(session.user_id))
         //socket.emit('welcome',{previousNums:sentNums,code:num,game:gamerunning});
            //else
        if(gamerunning)
            socket.emit('welcome',{previousNums:sentNums,code:num,game:gamerunning,winner:winner,round:round});
        else
            socket.emit('welcome',{previousNums:0,code:00,game:gamerunning,winner:winner,round:round});
    }
    //console.log(users.getNum(session.user_id));
    users.setSocket(session.user_id,socket.id)
    //console.log(session,session.user_id);
    connectionSetup();
    if(seed)
    ne()
    //console.log("welcome",socket.id)
    socket.on('startgame',function(){
        if(seed){
            console.log("Startgame");
            connectionSetup();
            io.sockets.emit('gamestarted')
        }
        if(new Date()> StartTime){
        socket.emit('welcome',{previousNums:sentNums,code:num,game:gamerunning,winner:winner,round:round});
        }
    })
    socket.on('clicknum',function(data){
        users.clickNum(session.user_id,data.number)
    })
    socket.on('disconnect',socketdisconnect);
    socket.on('clam',function(data){
        claming(data,socket,session);
    })
    socket.on('chatmsg',function(data){
       socket.broadcast.emit('broadmsg',data);
    })
})
function connectionSetup(){
    if(seed && new Date > StartTime&&round<11){
        seed=false;
        gamerunning=true;
        prepareNumlist(num,maximum);
        winner={};
        //console.log(numlist,sentNums);
        seeder= setInterval(ne,ttu*1000);
        console.log("Created Timer");
    }
}
function prepareNumlist(num,maximum){
    sentNums = [];
    for(var i=1;i<=maximum;i++){
        numlist[i-1]=i;
    }
    numlist.splice(num-1,1);
    sentNums.push(num);
    return;
}
function socketdisconnect(){
    //var a=io.sockets.clients();
    //if(Object.keys(io.connected).length==1){
        //clearInterval(seeder);
        //seed= true;
        //console.log("Cleared Interval");
    //}
    //console.log("disconnected",Object.keys(io.connected).length,numlist);
}
var checklist = {'uh':15,'fh':25,'lh':25},initial={'lh':11,'uh':0,'fh':0};
//Disabled count Check counts = {'uh':15,'lh':15,'fh':25};
function claming(data,socket,session){
    var count=0;
    var locallist = data.num;
    var obj = sentNums.slice(0);
    //console.log(locallist);
    if(locallist.length==0||obj.length==0||checklist[data.clams]>locallist.length)
        return false;
    for(var i=initial[data.clams];i<locallist.length && i<checklist[data.clams];i++){
        for(var j=0;j<obj.length;j++){
            if(obj[j]==locallist[i]){
                //count++;
                break
            }
        }
        //console.log(j+" After for loop")
        if(j==obj.length){
            console.log("False Clams");
            return false;
        }
    }
    io.sockets.emit('disableBtn',{btn:data.clams});
    //console.log(session);
    db.findOne({_id: DB.ObjectID(session.user_id)},function(err,row){
        console.log("Winner Name for "+data.clams+" is "+row.name);
        winner[data.clams]=row.name;
        db.save({'result':data.clams,'round':round,'name':row.name},function(result){
            console.log(result);
        });
        if(Object.keys(winner).length==3){
            resultDecleared();
        }
        console.log(winner,"Winner "+Object.keys(winner).length);
        io.sockets.emit('result',{clam:data.clams,name:row.name})
    })
    socket.emit('game',{status:"running"});
    console.log('Clam ' +data.clams+' has been won');
    //console.log(data,socket,session);
}
server.listen(3000);
