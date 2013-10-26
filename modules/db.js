var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
exports.ObjectID=ObjectID
ApplicationDB = function(host,port,user,password,dbname){
    this.db = new Db(dbname,new Server(host,port,{"safe":"false"},{"auto_reconnect":"true"}))
    this.db.open(function(err,db1){
        if(db1){
            if(user)
            db1.authenticate(user,password,function(err,data){
                if(data){
                    console.log("DB opened");
                }
                else{
                    console.log("Error in auth",err);
                }
            })
        }
        else{
            console.log("Error opening db",err);
        }

    })
   }

ApplicationDB.prototype.getCollection = function(callback){
    this.db.collection('bingo',function(err,bingo_collection){
        if(err)
            callback(err);
        else
            callback(null,bingo_collection);
    });
}

ApplicationDB.prototype.findOne= function(data,callback){
    this.getCollection(function(err,bingo_collection){
        if(err)
            callback(err)
        else{
        bingo_collection.findOne(data,function(err,result){
            if(err)
                callback(err);
            else
                callback(null,result)
    })

        }
    })
}

ApplicationDB.prototype.save=function(data,callback){
    this.getCollection(function(err,bingo_collection){
        if(err)
            callback(err);
        else{
            if(typeof(data.length)=='undefined')
                data=[data];
            for(var i=0;i<data.length;i++){
                element=data[i];
                element.created = new Date();
            }
            bingo_collection.insert(data,function(){
                console.log("Inserting data in DB",data);
                callback(null,data)
            })
        }
    })
}
exports.ApplicationDB = ApplicationDB;
