$(function () {
    let letao = new Letao();
    letao.login();
})

const Letao = function () {

};

Letao.prototype = {
    // 登录方法
    login: function () {
        // 1. 给登录按钮添加点击事件
        $("#login").on("tap", function () {
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
            // 3. 获取用户名和密码
            const username = $("#username").val();
            const password = $("#password").val();
            // 4. 调用登录的API实现登录功能
            $.ajax({
                url: "/user/login",
                type: "post",
                data: { "username": username, "password": password },
                success: function (data) {
                    // 5. 判断登录是否成功
                    if (data.error === 403) {
                        // 用户名或密码错误
                        mui.toast(data.message, { duration: "long", type: "div" });
                    }else {
                        // 登录成功 跳转到个人中心
                        window.location.href = "user.html";
                        // location.reload();
                    }
                }
            })
        })


    }
}