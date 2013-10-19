$(function(){
    $("#submit").click(function(){
        var name = $('#name').val();
        var pass = ($('#pass1').val()===$('#pass2').val())?$('#pass1').val():'';
        var email = $('#email').val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(name == '' || pass == '' || email == '' || !re.test(email))
        {
            alert('Invalid data');
            return;
        }
        console.log($('#name'),$('#pass1'),$('#pass2'),$('#email'));
        $.post('/register',{name:name,pass:$.md5(pass),email:email},function(data){
            data=JSON.parse(data);
            console.log(data);
        })
    });
})
