$(function(){
    const letao = new Letao();
    // 调用查询用户的方法
    letao.queryUser();
    // 调用用户操作函数
    letao.userOption();
    // 调用点击切换分页的函数
    letao.goToPage();
})


const Letao = function() {

}

Letao.prototype = {
    // 查询用户信息
    queryUser: function(page,pageSize){
        const that = this;
        // 1. 调用获取用户信息的API
        $.ajax({
            url: "/user/queryUser",
            data: {page: page || 1,pageSize: pageSize || 5},
            success: function(data) {
                const html = template("uesrTmp",data);
                // 查询的时候获取到了data数据传递给分页函数
                $('.user-info tbody').html(html);
                that.page(data);
            }
        })
    },
    // 用户禁用启用操作
    userOption: function () {
        const that = this;
        // 1. 给所有禁用启用按钮添加事件
        $(".user-info tbody").on("tap",".btn-option",function(){
            // 2. 获取当前用户的id状态
            const id = $("this").data("id");
            const isDelete = $("this").data("id-delete");
            // 3. 判断当前的状态 如果你是禁用的0 点击了后变成启用1
            if(isDelete){
                isDelete = 0;
                $(this).removeClass().addClass("btn btn-danger btn-option");
            }else {
                isDelete = 1;
                $(this).removeClass().addClass("btn btn-success btn-option");
            }
            // 4. 更新页面的状态
            $(this).attr("data-is-delete",isDelete);
            // 5. 调用API改变用户状态
            $.ajax({
                url: "/user/updateUser",
                type: "post",
                data: {id: id,isDelete: isDelete},
                success: function (data) {
                    // 6. 更新完毕后 重新渲染页面
                    that.queryUser(1,2);
                }
            })
        });
    },
    // 分页函数
    page: function(data){
        console.log(1);
        // 1. 接收参数获取到实现分页的术
        // 2. 创建一个总页数
        data.pageCount = Math.ceil(data.total / data.size);
        var arr = [];
        for(let i =1;i<= data.pageCount;i++){
            arr.push(i);
        }
        data.pageCount = arr;
        const html = template("pageTmp",data);
        $(".page").html(html);
    },
    // 点击了切换到某页
    goToPage: function(){
        const that = this;
        // 使用委托的方式添加事件 千万不要加很多次
        $('page').on("click","pagination li a",function(){
            // 1. 获取当前点击要切换到的页面
            const page = $(this).data("page");
            // 2. 获取当前最大页
            const pageCount = $(this).data("pageCount");
            // 3. 判断当前要跳转到的数据小于第一页 或者 大于最后一页 默认第一和最后一页
            // if(page <= 1){
            //     page = 1;
            // }
            // if(page >= pageCount){
            //     page = pageCount;
            // }
            that.queryUser(page,2);
        })
    }
}