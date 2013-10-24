exports.User=function User (socket,number,id){
    this.socket=socket;
    this.number=number;
    this.id=id;
}
exports.users=users;
var users={};
exports.AddUser = function(id){
    console.log("Inside add user module user");
    users[id]=id;
}
exports.setSocket = function(id,socket){
   console.log("Inside setSocket module user");
   users[id].socket=socket;
}
exports.setNum = function(id,num){
   console.log("Inside setNum module user");
   users[id].num=num;
}
exports.listuser = function(){
    console.log(users);
}
