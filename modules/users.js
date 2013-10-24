var user={};
exports.AddUser = function(id){
    console.log("Inside add user module user");
    user[id]={};
    user[id]['id']=id;
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
exports.listuser = function(){
    console.log("Listing all Users");
    console.log(user);
}
