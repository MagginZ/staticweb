// 动态获取屏幕大小
var retStatus = {
    sendSuccess: 100000,
    regSuccess: 200002,
    captchaEx: 300003,
    userExisted: 200001,
    wrongCaptcha: 300002,
    linkIllegal: 400015,
    reqFrequent: 100100,
    waitOneMinute: 100101
};
// var registerHost = "47.52.207.212:9090"
// var registerHost = "http://192.168.1.74:8372";
//  var registerHost = "http://192.168.1.35:8372";
var registerHost = "https://invite.blockcdn.org";
var jsonHost = "https://invite.blockcdn.org/app/invite/json?c=en";
var code = window.location.search.substring(1);

/*************点击尖括号显示选择区号***************/
$("#choose").click(function(){
    $.ajax({
        type: "GET",
        url: jsonHost,
        dataType: "json",
        success:function(data){
            var html="";
            $.each(data.data,function(i,item){
                //  html+=`<li>+<span class="country-code">${item.phoneCode}</span>&nbsp;&nbsp;&nbsp;<span class="country-name">${item.countryName}</span></li>`
                html+='<li>+<span class="country-code">' + item.phoneCode  + '</span>&nbsp;&nbsp;&nbsp;<span class="country-name">' + item.countryName + '</span></li>'

            })
            $(".country-list").html(html);
            $(".country-list").on("click", "li", function(){
                var countryCode=this.innerHTML.replace(/[^0-9]/ig, "");
                $("#chooseCountry").html(countryCode);
                $(".choose-phone-code").hide(500);
            })
        }
    })

    $(".choose-phone-code").show(500);
})
    /*********点击back尖括号隐藏*********/
    $(".back").click(function(){
        $(".choose-phone-code").hide(500);
    })

    /********点击获取验证码请求验证码*********/
    var wait = 60;
    $(".sendCaptcha").click(function(e){
            e.preventDefault();
            var phoneNumber=$("#phoneNumber").val().trim();
            var areaCode=$("#chooseCountry").text().trim();
            var data={
                "phoneNumber":phoneNumber,
                "areaCode":areaCode.toString(),
                "code":code.substring(5).replace("&lang=en","")
            }
            var url= registerHost + "/app/invite/gencaptcha";
            if(phoneNumber!="" && phoneNumber.length>5){
                $.post(url, data, function(rsp){
                    if(rsp.RetCode == retStatus.sendSuccess){
                        if(rsp.RetCode == retStatus.sendSuccess){
                            var timer = setInterval(function () {
                                wait--;
                                $('.sendCaptcha').attr('disabled', true)
                                $(".sendCaptcha").html(wait + "s");
                                if (wait == 0) {
                                    $(".sendCaptcha").html("SEND");
                                    clearInterval(timer);
                                    wait = 60;
                                    $('.sendCaptcha').attr('disabled', false)
                                }
                            }, 1000)
                        }
                    }else if (rsp.RetCode == retStatus.reqFrequent) {
                        alert("Too frequent operation")
                    } else if (rsp.RetCode == retStatus.waitOneMinute){
                        alert("Please wait on minute")
                    }
                })
            }else{
                alert(" Please enter the correct phone number ")
                click = false;
            }
    })
    /*******注册*******/
    $(".register-btn").click(function(e){
        e.preventDefault();
        var areaCode=$("#chooseCountry").text().trim();
        var phoneNumber=$("#phoneNumber").val().trim();
        var captcha=$("#captcha").val().trim();
        var password=$("#password").val().trim();
        var nickname =$("#nickname").val().trim();
        var url= registerHost + "/app/invite/register";
        var reqData={
            "phoneNumber":phoneNumber,
            "captcha":captcha,
            "areaCode":areaCode,
            "passwd":md5(password),
            "nickname":nickname,
            "code": code.substring(5)
        }
        if(phoneNumber=="" || captcha=="" || password=="" || nickname==""){
            alert("Can not be null");
        } else if (password.length<6){
            alert("Password is too simple");
        }else if (nickname.length<4){
            alert("Username is at least four characters");
        }else {
            $.ajax({
                type:"POST",
                url:url,
                data:reqData,
                success:function(retData) {
                    if (retData.RetCode == retStatus.linkIllegal) {
                        alert("link Illegal")
                    } else if(retData.RetCode == retStatus.regSuccess){
                        $(".register-success").fadeIn(500);
                    } else if (retData.RetCode == retStatus.captchaEx) {
                        alert("The captcha expired")
                    } else if (retData.RetCode == retStatus.userExisted){
                        alert("User Existed")
                    } else if (retData.RetCode == retStatus.wrongCaptcha){
                        alert("Wrong Captcha")
                    }
                }
            })
        }
    })
