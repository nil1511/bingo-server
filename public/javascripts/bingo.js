$(function(){
    var numobj=[];
    var previousNum=[0,0];
    var previousClamable= true;
    var myname;
    if(navigator.userAgent.search('Chrome')+1){
        $('.card td').css('background','#FC9C21')
        console.log("You are using  chrome");
    }else if(navigator.userAgent.search('Firefox')+1){
        $('.card td').css('background','green')
        console.log("You are using Firefox");
    }
    $('.num').click(function(e){
        console.log($(this).children('b').html());
        var clickNum = $(this).children('b').html();
        if(clickNum!=$('#generator').html()){
            if(clickNum!=previousNum[1])
                if(clickNum!=previousNum[0])
                {
                    if(previousNums.length!=0&&previousClamable){
                        for(var i=0;i<previousNums.length;i++){
                            if(previousNums[i]==clickNum){
                                performClick(this)
                                return false;
                            }
                        }
                        return false;
                    }
                    else {
                        return false;
                    }
                }
        }
        performClick(this)
    })
    function performClick(cell){
        console.log("Click"+cell);
       var clickNum = $(cell).children('b').html();
       var idno = parseInt($(cell).attr('id').split('cell')[1]);
        --idno;
        console.log(idno);
        numobj[idno]=parseInt(clickNum);
        //if($(cell).css('background-color')=='')
        $(cell).css('background-color','rgb(41, 128, 185)')
         console.log(numobj);
    }
    var socket = io.connect();
    var localnums=[];
    var myNum=[] ;
    var previousNums=[];
    socket.on('whoami',function(data){
        myname=data.name;
        console.log(myname,data);
    })
    socket.on('welcome',function(data){
        console.log(data);
        myNum= data.yourNum;
        previousNums=data.previousNums;
        //console.log($('#previousdeclaredNum').html());
        $('#previousdeclaredNum').html(previousNums[0])
        if(data.game){
            $('.prenums').html('Numbers Declared when you were not online you have '+(previousNums.length*5) +' seconds to fill them');
        for(var i=1;i<previousNums.length;i++){
            $('#previousdeclaredNum').html($('#previousdeclaredNum').html()+","+previousNums[i])
        }
        setTimeout(function(){
            previousClamable=false;
            $('#previousdeclaredNum').css('color','red');
        },5000*previousNums.length);
        $('#allNum').html($('#previousdeclaredNum').html())
        }
        else{
            $("#previousdeclaredNum").html("Sorry,Game is Over")
        }
        showNum(data);
    })
    $('#letsplay').click(function(){
        if($(this).hasClass('btn-danger'))
            return;
        socket.emit('startgame');
        //$('.instruction').hide();
        //$('.game').show();
   })
   socket.on('gamestarted',function(){
        $('.instruction').hide();
        $('.game').show();
   })
    socket.on('starttime',function(data){
        if(data.time){
            $('.game').hide();
            $('.instruction').show();
         var ctime=new Date(data.stime);

       var timer=setInterval(function(){
                var time =new Date(data.time);
                ctime=new Date(ctime.getTime()+1000);
                var tt= stoh(time-ctime);
                if(tt.h<0){
                    $('#time').html('You can Start Playing');
                    $('#letsplay').removeClass('btn-danger').addClass('btn-success')
                    clearInterval(timer);
                    return;
                }
                //console.log(ctime,time,tt);
                $('#time').html("Game Starts in "+tt.h+" hours "+tt.m+" mins "+tt.s+" seconds")
            },1000)
        }
        //console.log(data);
    })
    function stoh(diff){
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        return {h:hh,m:mm,s:ss}
    }
    socket.on('no',showNum)
    function showNum(num){
        //console.log(num.code,arguments);
        previousNum[0]=previousNum[1];
        previousNum[1]=parseInt($('#generator').html())
        $('#pre').html(previousNum[0]+","+previousNum[1])
        if($('#allNum').html()=='')
            $('#allNum').html(num.code);
        else{
            var cstring = $('#allNum').html();
            var nu = cstring.substring(1+cstring.lastIndexOf(','));
            if(nu!=num.code)
            $('#allNum').html($('#allNum').html()+","+num.code);
        }
        $('#generator').html(num.code)
        //for(var i=0;i<25;i++){
            //if(myNum[i]==num.code)
                //$('#cell'+(i+1)).trigger('click');
        //}

        localnums.push(num.code);
    }
    socket.on('result',function(data){
        if(data.clam)
            $('#'+data.clam+'name').html(data.name);
        console.log(data.clam,data.name);
    })
    $('#chatmsg').keydown(function(e){
        if(e.keyCode==13){
            if($('#chatmsg').val()!=''){
            socket.emit('chatmsg',{msg:$('#chatmsg').val(),sender:myname})
            $('.msgs').append('<blockquote style="width:100%"><p>'+$('#chatmsg').val()+'</p><small>'+myname+'</small></blockquote>')
            }
            $('#chatmsg').val('');
            $('.messages').scrollTop($('.messages')[0].scrollHeight)
        }
    })
    socket.on('broadmsg',function(data){
        console.log(data);
        $('.msgs').scrollTop(999999999)
        $('.msgs').append('<blockquote class="pull-right" style="width:100%"><p>'+data.msg+'</p><small>'+data.sender+'</small></blockquote>')
    })
    socket.on('game',function(data){
        console.log(data);
        if(data.status=="game_over")
            alert('Game Over but you can clam unclamed houses');
        if(data.status=="running"){
            $('.clams').attr('disabled','true');
        }
    });
    socket.on('message',function(d){
        console.log(d);
    });
    socket.on('disableBtn',function(data){
        console.log(data);
        $('#'+data.btn).attr('disabled','true');
    })
    $(document).on('click','.clams',function(){
        switch ($(this).attr('id')) {
            case 'uh':
                console.log("uh");
                for(var i=0;i<15;i++){
                    if(numobj[i]==null)
                        return false;
                }
                console.log('I am Claming uh');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            case 'lh':
                console.log('lh');
                for(var i=10;i<25;i++){
                    if(numobj[i]==null)
                        return false;
                }
                console.log('I am Claming lh');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            case 'fh':
                console.log('fh')
                for(var i=0;i<25;i++){
                    if(numobj[i]==null)
                        return false;
                }
                console.log('I am Claming full house');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            default:
        }
    })
});
