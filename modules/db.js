var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ApplicationDB = function(host,port,dbname){
    this.db = new Db(dbname,new Server(host,port,{"safe":"false"},{"auto_reconnect":"true"}))
    this.db.open(function(){})
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
                callback(null,data)
            })
        }
    })
}
exports.ApplicationDB = ApplicationDB;
