var user={};
exports.AddUser = function(id,name){
    console.log("Inside add user module user");
    user[id]={};
    user[id]['id']=id;
    user[id]['name']=name;
}
exports.setSocket = function(id,socket){
   console.log("Inside setSocket module user");
   user[id]['socket']=socket;
}
exports.setNum = function(id,num){
   console.log("Inside setNum module user");
   user[id]['num']=num;

}
exports.getNum = function(id){
    console.log("Getting the list of number of user");
    if(typeof user[id]!='undefined' && typeof user[id].num!='undefined')
    return user[id].num;
    else
        return null;
}
exports.getSocket = function(id){
    console.log("Getting the socketid of user");
    if(typeof user[id]!='undefined' && typeof user[id].socket!='undefined')
    return user[id].socket;
    else
        return null;
}
exports.getName = function(id){
    console.log("Getting the name of user");
    if(typeof user[id]!='undefined' && typeof user[id].name!='undefined')
    return user[id].name;
    else
        return null;
}
exports.listuser = function(){
    console.log("Listing all Users");
    console.log(user);
}
exports.noOfUsers=function(){
    console.log("No of users in memory "+Object.keys(user).length);
}
exports.clickNum=function(id,number,list){
    if(typeof list != "undefined" && list && user[id].clickNums){
        return user[id].clickNums;
    }
    else if(typeof number != "undefined"){
        if(typeof user[id].clickNums == "undefined")
            user[id]['clickNums']=[];
        return user[id]['clickNums'][user[id].clickNums.length]=parseInt(number);
    }
    else if(typeof user[id].clickNums!= "undefined")
        return user[id].clickNums;
    else
        return null;
}
exports.notExist=function(id){
    //console.log("Checking whether user exist or not",user[id]);
    if(typeof user[id]=="undefined")
        return true;
    else
        return false;
}
