$(function() {
    $(document).on('click','#register',function(e){
        var name = $("#ruser").val(),
        pass=$("#pass1").val(),
        email=$('#email').val();
       if($('.login').is(':visible')){
          $('.login').fadeOut('fast',function(){
            $('.register').fadeIn('fast');
          })
       }
       else{
            if(name==''||pass==''||email=='' ||$('.has-error').length)
                {
                    console.log("Invalid data");
                }
            else{
                $.ajax({
                    type:"POST",
                    url:"/register",
                    data:{"name":name,"pass":$.md5(pass),"email":email}
                }).done(function(data){
                    data=JSON.parse(data);
                    if(data.code==2)
                        {
                            $('.register > input').val('')
                            $('#username').val(name);
                            $('#submit').trigger('click');
                        }
                    console.log(data,data.code);
                });

            }
       }
    })
    $('#password').keydown(function(e){
        if(e.keyCode==13)
            $('#submit').trigger('click');
    })
    $(document).on('click','#submit',function(e){
        if(!$('.login').is(':visible')){
            $('.register').fadeOut('fast',function(){
                $('.login').fadeIn('fast');
            })
           return false;
        }
        var username=$('#username').val(),password=$("#password").val();
        if(username=='' || password ==''){
            return false;
        }
        else{
            $.ajax({
                type:"POST",
                data:{"name":username,"password":$.md5(password)},
                url:'/login'
            }).done(function(res){
                if(res==1){
                    $('#password').val('');
                    window.location.href='/bingo';
                }
                else{
                    console.log("Username password incorrect");
                }
            })
        }
    })
    $('#ruser').blur(function(){
        var name=$('#ruser').val();
        if(name.length<4){
                $('#ruser').prev('.control-label').attr('for','inputError').html('Username must be atleast 4 letter long')
                $('#ruser').parent('.form-group').removeClass('has-success').addClass('has-error');
            return;
        }
        $.ajax({
            type:"POST",
            url:"/checkusername",
            data:{"name":name}
        }).done(function(data){
            if(data==0){
                $('#ruser').prev('.control-label').attr('for','inputSuccess').html('Username is available')
                $('#ruser').parent('.form-group').removeClass('has-error').addClass('has-success');
            }
            else{
                $('#ruser').prev('.control-label').attr('for','inputError').html('Username is not available')
                $('#ruser').parent('.form-group').removeClass('has-success').addClass('has-error');
            }
        })
    })
    $('#pass2').blur(function(){
        if($('#pass1').val()=='')
            return false;
        if($('#pass1').val()===$('#pass2').val())
        {
            $('#pass1').parent('.form-group').removeClass('has-error').addClass('has-success')
            $('#pass2').parent('.form-group').removeClass('has-error').addClass('has-success')
        }
        else{
            $('#pass2').parent('.form-group').removeClass('has-success').addClass('has-error')
            $('#pass1').parent('.form-group').removeClass('has-success')
        }
    })
    $('#email').change(function(){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test($('#email').val()))
            $('#email').parent('.form-group').removeClass('has-error').addClass('has-success')
        else
            $('#email').parent('.form-group').removeClass('has-success').addClass('has-error')
    })
});

