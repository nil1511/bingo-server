$(function(){
    var colors = ['#E67E22','#E74C3C','#7F8C8D','#8E44AD','#2980B9','#27AE60','#F39C12','#1ABC9C'];
    var colorstart = Math.floor(Math.random()*colors.length);
    $('.num').click(function(e){
        if($(this).css('background-color')=='rgba(0, 0, 0, 0)')
        $(this).css('background',colors[colorstart++%colors.length])
    })
    var socket = io.connect('http://127.0.0.1:3000');
    socket.on('no',function(num){
        //console.log(num.code,arguments);
        $('#generator').html(num.code)
    })


});
