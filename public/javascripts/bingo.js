$(function(){
    var colors = ['#E67E22','#E74C3C','#7F8C8D','#8E44AD','#2980B9','#27AE60','#F39C12','#1ABC9C'];
    var colorstart = Math.floor(Math.random()*colors.length);
    var numobj={};
    $('.num').click(function(e){
        console.log($(this).children('b').html(),$(this));
        if($(this).children('b').html()!=$('#generator').html())
            return false;
        numobj[$(this).attr('id').split('cell')[1]]=$(this).children('b').html();
        if($(this).css('background-color')=='rgba(0, 0, 0, 0)')
        $(this).css('background',colors[colorstart++%colors.length])
         console.log($(this),numobj);
    })
    //var socket = io.connect('http://bingo.nodejitsu.com');
    var socket = io.connect('http://127.0.0.1:3000');
    socket.on('no',function(num){
       console.log(num.code,arguments);
        $('#generator').html(num.code)
    })
    socket.on('result',function(data){
        console.log(data);
        if(data.disablebtn){
            $('#'+data.disablebtn).attr('disabled','true')
        }
    })
    socket.on('game',function(data){
        console.log(data);
        if(data.status=="game_over")
            alert('Game Over');
    })
    socket.on('message',function(d){
        console.log(d);
    })
    $(document).on('click','.clams',function(){
        switch ($(this).attr('id')) {
            case 'uh':
                console.log("uh");
                for(var i=1;i<=15;i++){
                    if(numobj[i]==null&& false)
                        return false;
                }
                console.log('I am Claming uh');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            case 'lh':
                console.log('lh');
                for(var i=25;i>=11;i--){
                    if(numobj[i]==null&& false)
                        return false;
                }
                console.log('I am Claming');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            case 'fh':
                console.log('fh')
                for(var i=1;i<=25;i++){
                    if(numobj[i]==null&& false)
                        return false;
                }
                console.log('I am Claming full house');
                socket.emit('clam',{clams:$(this).attr('id'),num:numobj})
                break;
            default:

        }
    })
});
