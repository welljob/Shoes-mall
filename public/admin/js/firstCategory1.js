$(function () {
    var letao = new LETAO();
    //调用查询用户的方法
    letao.queryTopCategory(1, 5);
    letao.addFirstCategory();

    //调用点击切换分页的函数
    letao.goToPage();
})

const LETAO = function () { };

LETAO.prototype = {
    // 查询一级分类列表
    queryTopCategory: function (page, pageSize) {
        const THAT = this;
        // 1. 调用获取用户信息的API
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            data: { page: page || 1, pageSize: pageSize || 5 },
            success: function (data) {
                const HTML = template("firstCategoryTmp", data);
                $('.user-info tbody').html(HTML);
                // 查询的时候获取到了data数据传递给分页函数
                THAT.page(data);
            }
        })
    },
    // 添加一级分类
    addFirstCategory: function () {
        const THAT = this;
        // 1. 给保存按钮添加点击事件
        $("btn-save").on("click", function () {
            // 2. 获取模态框里面的输入分类的名称
            let catagoryName = $(".first-category").val();
            if (!categoryName.trim()) {
                return;
            }
            // 3. 调用添加一级分类的API实现添加分类
            $.ajax({
                url: '/category/addTopCategory',
                type: "post",
                data: { categoryName: catagoryName },
                success: function (data) {
                    // 4. 判断如果添加成功调用查询分类列表
                    THAT.queryTopCatagory(1, 5);
                }
            });
        })
    },
    // 分类函数
    page: function (data) {
        console.log(data);
        // 1. 接收参数获取到实现分页的数据
        // 2. 创建一个总页数
        data.pageCount = Math.ceil(data.total / data.size);
        let arr = [];
        for (let i = 1; i <= data.pageCount; i++) {
            arr.push(i);
        }
        data.pageCount = arr;
        let html = template("pageTmp", data);
        $(".page").html(html);
    },
    // 点击了切换到某页
    goToPage: function () {
        var that = this;
        //使用委托的方式添加事件 千万不要加很多次
        $('.page').on('click', '.pagination li a', function () {
            // 1. 获取当前点击要切换到的页面
            var page = $(this).data('page');
            // 2. 获取最大页数
            var pageCount = $(this).data('pageCount');
            // 3. 判断当前要跳转到的页数据小于第一页 或者 大于最后一页 默认为第一和最后一页
            // if(page <= 1){
            //  page = 1;
            // }
            // if(page >= pageCount){
            //  page = pageCount;
            // }
            //调用查询分类的函数
            that.queryTopCategory(page, 5);
        });
    }
}