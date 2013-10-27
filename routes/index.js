
/*
 * GET home page.
 */
var users= require('../modules/users')
exports.index = function(req, res){
  res.render('index', { title: 'Bingo',page:'index' });
};
exports.bingo = function(req,res){
    var number=users.getNum(req.session.user_id),clickNum=null;
    if(number==null){
        number = getBingoCard(1,100,25)
        users.setNum(req.session.user_id,number);
    }
    else{
        clickNum=users.clickNum(req.session.user_id,undefined,true);
        console.log("Clicked",clickNum);
        if(clickNum)
        console.log("length",clickNum.length);
    }
    res.render('bingo',{page:'bingo',number:number,clicked:clickNum});
}
exports.how= function(req,res){
    res.render('howtoplay',{title:'Bingo',page:'how'});
}
function getBingoCard(min,max,no){
    var ob={};
    var number = [];
    for(var i=0;i<no;i++){
        var temp = Math.floor((Math.random()*max)+min);
        if(ob[temp]==null){
            number.push(temp)
        }
        ob[temp]=temp;
        if((i+1)==no && Object.keys(ob).length!=no){
            i=i-(no-Object.keys(ob).length);
            //console.log('in obj i modifier');
        }
    }
    for(var i=0;i<number.length;i++){
        for(var j=0;j<number.length;j++){
            if(number[i]<number[j])
                {var t = number[j]
                    number[j]=number[i];
                    number[i]=t;
                }
        }
    }
    //console.log(ob,Object.keys(ob).length,number.length);
    return number;
}
