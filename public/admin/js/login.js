$(function(){
    const letao = new Letao();
    letao.login();
});

const Letao = function(){};

Letao.prototype = {
    // 后台登录的方法
    login: function(){
        // 1. 获取登录按钮添加点击事件
        $(".btn-login").on("click",function(){
            // 2. 获取当前输入的用户名和密码
            const username = $(".username").val();
            const password = $(".password").val();
            // 3. 判断输入框是否有输入
            let check = true;
            $("input").each(function(){
                // 若当前input为空 则alert提醒
                if(!this.value || this.value.trim() == ""){
                    // 获取输入框里面的placeholder属性的值
                    let label = $(this).attr("placeholder");
                    alert(label + "不允许为空");
                    check = false;
                    return false;
                }
            });
            // 校验通过，继续执行业务逻辑
            if(!check) {
                return;
            }
            // 4. 调用后台登录的API实现登录功能
            $.ajax({
                url: "/employee/employeeLogin",
                type: "post",
                data: {username: username,password: password},
                success: function(data){
                    // 5. 判断如果API返回错误表示用户名错误或者密码错误
                    if(data.error) {
                        alert(data.message);
                    }else {
                        // 6. 登录成功 跳转到后台首页
                        window.location.href = "index.html";
                    }
                }
            })
        })
    }
}