$(function(){
    $("#submit").click(function(){
        var name = $('#name').val();
        var pass = ($('#pass1').val()===$('#pass2').val())?$('#pass1').val():'';
        var email = $('#email').val();
        if(name == '' || pass == '' || email == '')
        {
            alert('Invalid data');
            return;
        }
        console.log($('#name'),$('#pass1'),$('#pass2'),$('#email'));
        $.post('/register',{name:name,pass:pass,email:email},function(d){
            console.log(d);
        })
    });
})
