$(function () {
    let letao = new Letao();

    // 获得最新的验证码
    let vCode = "";
    
    letao.register();

    letao.getvCode();

})

const Letao = function () {

};

Letao.prototype = {
    // 注册方法
    register: function () {
        // 1. 给注册按钮注册点击事件
        $("#register").on("tap", function () {
            // 2. 验证是否输入
            let check = true;
            mui("#input_example input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
            });
            if (!check) {
                return;
            }

            // 3. 获取手机号 用户名 密码 确认密码 验证码
            const mobile = $("#mobile").val();
            const username = $("#username").val();
            const password1 = $("#password1").val();
            const password2 = $("#password2").val();
            const nowvCode = $("#vCode").val();

            // 4. 判断两次输入密码是否一致
            if(password1 !== password2){
                mui.alert("两次输入的密码不一致");
                return;
            }

            // 5. 判断当前输入的nowvCode 验证码和之前获取的验证码是否一致
            if(nowvCode !== vCode) {
                mui.alert("验证码不一致");
                return;
            }

            // 6. 调用注册的API实现注册功能
            $.ajax({
                url: "/user/register",
                type: "post",
                data: {"username": username,"password": password2,"mobile": mobile,"vCode": nowvCode},
                success: function(data) {
                    // 7. 判断是否注册成功
                    if(data.error > 400){
                        mui.alert(data.message);

                    }else {
                        // 注册 返回上一页登录
                        window.location.href = "login.html";
                    }
                    
                }
            })

        })
    },
    // 点击获取验证码
    getvCode: function(){
        // 1. 给获取验证码添加点击事件
        $("#getvCode").on("tap",function(){
            $.ajax({
                url: "/user/vCode",
                success: function(data){
                    console.log(data);
                    vCode = data.vCode;
                }
            })
        })
    }
}