exports.User=function User (socket,number,id){
    this.socket=socket;
    this.number=number;
    this.id=id;
}
exports.users=users;
var users={};
exports.AddUser = function(id){
    users[id]=id;
}
exports.setSocket = function(id,socket){
    users[id].socket=socket;
}
exports.setNum = function(id,num){
    users[id].num=num;
}
exports.listuser = function(){
    console.log(users);
}
