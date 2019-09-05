$(function(){
    const letao = new Letao();
    // 调用获取用户信息
    letao.queryUserMessage();
    // 调用退出登录
    letao.logout();
})


const Letao = function() {

}

Letao.prototype = {
    // 查询用户信息的方法
    queryUserMessage: function() {
        // 1. 调用queryUserMessage API获取用户信息
        $.ajax({
            url: "/user/queryUserMessage",
            success: function(data){
                // 2. 判断当前是否查询成功 不成功表示为登录
                if(data.error){
                    // 3. 跳转到登录页面
                    window.location.href = "login.html";
                }else {
                    // 4. 如果查询成功把用户名和手机号码渲染出来
                    $(".username").html(data.username);
                    $(".mobile").html(data.mobile);
                }
            }
        })
    },
    // 退出登良路
    logout: function(){
        // 1. 给退出按钮添加点击事件
        $(".btn-exit").on("tap",function(){
            // 2. 调用退出登录的API实现提出
            $.ajax({
                url: "/user/logout",
                success: function (data){
                    // 3. 判断如果退出成功就跳转登录
                    if(data.success){
                        window.location.href = "login.html";
                    }
                }
            })
        })
    }
}