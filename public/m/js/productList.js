$(function () {
    var letao = new Letao();
    //初始化下拉刷新和上拉加载更多
    letao.initRefreshDownUp();
    // 调用根据url参数查询商品
    letao.querySelector();
    // 调用点击按钮搜索
    letao.searchProductLst();
    // 调用商品排序
    letao.sortProduct();

});

var Letao = function () {

}

// 1. 把search作为全局变量 当前需要搜索的内容
var search = getQueryString("search");
// 2. 当前的页面数 定义为全局变量
var page = 1;

//获取url参数的方法 传入参数名就可以获取参数的值
//默认获取中文是乱码 中文需要解码decodeURI对中文进行解码
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

Letao.prototype = {
    // 初始化下拉和上拉加载更多刷新方法
    initRefreshDownUp: function () {
        var that = this;
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
            //模拟请求网络延迟 实际开发不需要
            setTimeout(function () {
                // 在下拉刷新里面也要调用获取数据的方法
                // 下拉刷新的时候调用获取数据 多获取1条 页面多创建一个商品
                that.queryProductData({
                    proName: search,
                    page: 1,
                    pageSize: 3
                }, function (data) {
                    var html = template("productListTmp", data)
                    $(".product-list .content .mui-row").html(html);
                });
                //调用结束下拉刷新的方法 数据请求完毕后要结束下拉刷新 不结束会一直转
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                // 如果上拉已经到底 再次下拉刷新 重新开始 page重置为1
                page = 1;
                // 重置上拉加载效果
                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
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

                // 上拉加载就是要加载下一页的数据
                page++;
                that.queryProductData({
                    proName: search,
                    page: page,
                }, function (data) {
                    if (data.data.length > 0) {
                        var html = template("productListTmp", data)
                        // 上拉加载更多要在后面追加 渲染的时候要使用追加
                        $(".product-list .content .mui-row").append(html);
                        // 结束上拉加载更多 但是还可以再次上拉
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                    } else {
                        // 结束上拉加载更多 并且提示没有更多数据了 下次不能再拉了
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                    }

                })


            }, 3000);
        }
    },
    // 根据url参数获取商品列表数据
    querySelector: function () {
        // 1. 获取url参数的值 给全局search赋值
        // 2. 调用获取商品列表数据的方法
        this.queryProductData({
            proName: search
        }, function (data) {
            var html = template("productListTmp", data);
            $(".product-list .content .mui-row").html(html);
        })

    },
    // 点击当前页面的搜索按钮搜索新的商品
    searchProductLst: function () {
        var that = this;
        $(".btn-search").on("tap", function (event) {
            // 清除默认跳转
            event.preventDefault();

            var keyword = $(".search-input").val()

            // 判断是否为空
            if (!keyword.trim()) {
                mui.toast('请输入关键字', { duration: 'long', type: 'div' })
                return;
            }

            search = keyword;


            // 把搜索的内容存储到本地
            var searchData = JSON.parse(window.localStorage.getItem("searchLog")) || [];
            var id = 1;
            if (searchData.length > 0) {
                id = searchData[searchData.length - 1].id + 1;

                searchData = searchData.filter(function (item, index) {
                    if (item.search === search) {
                        console.log(item);
                        return false;
                    } else {
                        return true;
                    }
                })
            }
            searchData.push({ search: search, id: id })
            var jsonSearchData = JSON.stringify(searchData);
            window.localStorage.setItem("searchLog", jsonSearchData);

            // 请求数据，并渲染
            that.queryProductData({
                proName: search,
            }, function (data) {
                var html = template("productListTmp", data);
                $(".product-list .content .mui-row").html(html);
            })
        })
    },
    // 商品的排序
    sortProduct: function() {
        var that = this;
        $(".title .mui-row div a").on("tap",function(){
            // 给当前点击的父元素li添加acitve其余删除
            $(this).parent().addClass("active").siblings().removeClass("active");
            // 获取排序类型
            var type = $(this).data("type");
            // 获取目前排序状态
            var state = $(this).data("state") === 1 ? 2 : 1;
            
            // 请求数据，并渲染
            that.queryProductData({
                proName: search,
                [type]: state,

            }, function (data) {
                var html = template("productListTmp", data);
                $(".product-list .content .mui-row").html(html);
            })
            // 修改状态
            $(this).attr("data-state",state);
            // 修改字体图标
            $(this).children("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up")

        })
    },
    // 点击购买跳转到商品详情
    goDetail: function() {
        // 1. 给所有购物按钮添加点击事件 建议使用tap事件 因为MUI组织了click事件
        $(".contetn").on("tap",".product-by",function(){
            // 2.获取当前按钮的商品id
            var id = $(this).data("id");
            // 3. 使用js跳转到商品详情并且传入id
            window.location.href = "detail.html?id=" + id;
        })
    },
    // 获取商品列表的数据的公共方法 指定一个回调函数
    queryProductData: function (parmas, callback) {
        $.ajax({
            url: "/product/queryProduct",
            data: {
                proName: parmas.proName || "鞋",
                brandId: parmas.brandId || "",
                // 价格 和 数量排序没传入 默认为空 不要默认升序
                price: parmas.price || "",
                num: parmas.num || "",
                page: parmas.page || 1,
                pageSize: parmas.pageSize || 2
            },
            success: function (res) {
                // 当请求数据完成后回调函数把数据传递给回调函数的参数
                // if(callback) {
                //     callback(res);
                // }
                callback && callback(res);
            }
        })
    }
}
