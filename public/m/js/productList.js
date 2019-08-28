$(function () {
    var letao = new Letao();
    //初始化下拉刷新和上拉加载更多
    letao.initRefreshDownUp();
});

var Letao = function () {

}

Letao.prototype = {
    // 初始化下拉和上拉加载更多刷新方法
    initRefreshDownUp: function () {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //区域滚动的父容器
                down: {
                    callback: refreshDownCallback
                },
                up: {
                    callback: refreshUpCallback
                }
            }
        });
        //下拉刷新的回调函数
        function refreshDownCallback() {
            //模拟请求过程
            setTimeout(function () {
                console.log('数据刷新成功');
                //调用结束下拉刷新的方法 数据请求完毕后要结束下拉刷新 不结束会一直转
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            }, 1500);
        }
        //上拉加载更多的回调函数
        function refreshUpCallback() {
            //模拟请求过程
            setTimeout(function () {
                console.log('上拉加载成功');
                //结束上拉加载更多
                // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                //结束上拉加载更多并且提示没有更多数据了
                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }, 3000);
        }
    }
}
