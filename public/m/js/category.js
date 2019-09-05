// 使用zepto和jquery一样 使用入口函数
$(function () {

    var letao = new Letao();
    // 调用初始化区域滚动的方法
    letao.initScroll();
    // 调用获取一级分类的方法
    letao.queryTopCategory();
    // 调用分类左侧点击方法
    letao.catagoryLeftClick();
    // 默认调用获取右侧分类显示第一个分类的品牌
    letao.querySecondCategory(1);
});

var Letao = function () {

};

Letao.prototype = {
    // 初始化区域滚动
    initScroll: function () {
        // 初始化区域滚动插件
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    },

    // 获取一级分类的数据
    queryTopCategory: function () {
        // 1. 调用ajax请求
        $.ajax({
            type: "get",
            dataType: "json",
            // 相当于localhost:3000/category/queryTopCategory
            url: API_BASE_URL + "/category/queryTopCategory",
            // url: "/category/queryTopCategory",
            beforeSend: function (xhr, settings) {
                // 在发起请求时调用
                $(".loading").show();
            },
            success: function (data) {
                // 因为你们data不是一个对象 data数组
                // 模板引擎需要传入一个对象
                // var html = template("id",{{"list": data.rows}})
                $(".loading").hide();   // 请求成功隐藏
                var html = template("queryTopCategoryTmp", data);
                $(".category-left").html(html);
            }
        })
    },

    // 分类左侧点击
    catagoryLeftClick: function () {
        // 把letao对象保存到that变量中
        var that = this;
        // 1. 给左侧分类的a添加点击事件 如果a的动态生成的元素要使用委托
        // 移动端推荐使用tap 解决延迟
        $(".category-left").on("tap", "li a", function (event) {
            // 2. 给当前点击的父元素添加active 兄弟删除active类名
            $(this).parent().addClass("active").siblings().removeClass("active");
            // data方法专门用来获取自定义属性的值
            var id = $(this).data("id");
            // 使用letao对象调用方法
            that.querySecondCategory(id);
        });
    },

    // 获取二级分类
    querySecondCategory: function (id) {
        // 1. 使用ajax获取二级分类API
        $.ajax({
            url: "/category/querySecondCategory",
            data: { id: id },
            beforeSend: function (xhr, settings) {
                $(".loading").show();
            },
            success: function (data) {
                $(".loading").hide();     // 请求成功隐藏
                var html = template("querySecondCategory", data);
                $(".mui-scroll").html(html);
            }
        })
    }
}
