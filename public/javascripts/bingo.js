$(function(){
    var colors = ['#E67E22','#E74C3C','#7F8C8D','#8E44AD','#2980B9','#27AE60','#F39C12','#1ABC9C'];
    var colorstart = Math.floor(Math.random()*colors.length);
    var numobj=[];
    var previousNum=[0,0];
    $('.num').click(function(e){
        console.log($(this).children('b').html());
        var clickNum = $(this).children('b').html();
        if(clickNum!=$('#generator').html()){
            if(clickNum!=previousNum[1])
                if(clickNum!=previousNum[0])
                    return false;
        }
        var idno = parseInt($(this).attr('id').split('cell')[1]);
        --idno;
        console.log(idno);
        numobj[idno]=parseInt(clickNum);
        if($(this).css('background-color')=='rgba(0, 0, 0, 0)')
        $(this).css('background',colors[colorstart++%colors.length])
         console.log(numobj);
    })
    var socket = io.connect();
    var localnums=[];
    var myNum ;
    socket.on('welcome',function(data){
        console.log(data);
        myNum= data.yourNum;
    })
    socket.on('no',function(num){
       //console.log(num.code,arguments);
        previousNum[0]=previousNum[1];
        previousNum[1]=parseInt($('#generator').html())
        $('#pre').html(previousNum[0]+","+previousNum[1])
        $('#generator').html(num.code)
        for(var i=0;i<25;i++){
            if(myNum[i]==num.code)
                $('#cell'+(i+1)).trigger('click');
        }

        localnums.push(num.code);
    })
    socket.on('result',function(data){
        if(data.clam)
            $('#'+data.clam+'name').html(data.name);
        console.log(data.clam,data.name);
    })
    socket.on('game',function(data){
        console.log(data);
        if(data.status=="game_over")
            alert('Game Over');
        if(data.status=="running"){
            $('.clams').attr('disabled','true');
        }
    })
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
