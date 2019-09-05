$(function () {
    const letao = new Letao();
    // 调用查询商品的方法 传入需要的参数和回调函数
    letao.queryCart({
        page: 1,
        pageSize: 5
    },function(data){
        let html = template("cartTmp",data);
        $(".cart-list").html(html);
    })
    // 调用初始化下拉刷新和上拉加载更多
    letao.initRefreshDownUp();
});

let page = 1;
const Letao = function () {

};

Letao.prototype = {
    // 1. 查询购物车的商品
    queryCart: function (params, callback) {
        $.ajax({
            url: "/cart/queryCartPaging",
            data: { page: params.page, pageSize: params.pageSize },
            success: function (data) {
                // 判断是否成功
                if (data.error === 400) {
                    // 如果不成功
                    window.location.href = "login.html";
                } else {
                    // 如果获取成功调用回调函数 把数据传递给你自己渲染
                    callback && callback(data);
                }
            }
        })
    },
    // 2. 初始化下拉刷新和上拉加载
    initRefreshDownUp: function () {
        const that = this;
        // 1. 调用初始化下拉刷新
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper",
                // 区域滚动父容器
                down: {
                    callback: refreshDownCallback
                    // 指定下拉刷新的回调函数
                },
                up: {
                    callback: refreshUpCallback
                    // 指定上拉加载更多的回调函数
                }
            },
        });
        // 2. 下拉刷新的回调函数
        function refreshDownCallback() {
            setTimeout(function(){
                // 1. 调用获取购物车数据的方法
                that.queryCart({
                    page: 1,
                    pageSize:5
                },function(data){
                    let html = template("cartTmp",data);
                    $(".cart-list").html(html);
                    mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                    // 重置page 为1
                    page = 1;
                    // 重置上拉加载效果
                    mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                })
            },1500)
        }

        // 3. 上拉加载更多的回调函数
        function refreshUpCallback (argument){
            setTimeout(function(){
                that.queryCart({
                    page: ++page,
                    pageSize: 5
                },function(data){
                    // 判断返回的数据是否为一个数组 为数组 表示没有数据 返回不是数组 表示一个对象 表示有数据
                    // (data instanceof Array)  是一个表达式 要系括号包起来
                    if(!(data instanceof Array)){
                        let html = template("cartTmp",data);
                        // 上拉加载更多的时候要去追加
                        $(".cart-list").append(html);
                        // 结束上拉加载更多
                        mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh();
                    }else {
                        // 结束上拉加载更多 并且提示没有更多数据了
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                    }
                })
            },1500)
        }
    }

}