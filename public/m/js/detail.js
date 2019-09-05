$(function () {
    const letao = new Letao();
    // 初始化下拉刷新
    letao.initRefreshDown();
    let id = getQueryString("id");
    // 调用查询商品详情的API传入id和回调函数 并渲染
    letao.querProductDetail(id, function (data) {
        // 1. 调用轮播图模板生成基本结构        
        var html = template("slideTmp", data);
        $("#slide").html(html);
        // 如果要动态添加轮播图那么需要 轮播图加载完毕再初始化
        letao.initSlide();

        /* 
        // 1. 调用轮播图模板生成轮播基本结构
        var html = template('slideTmp', data);
        $('#slide').html(html);
        //2. 获取所有轮播图的图片
        var slideItems = $('.mui-slider-loop .mui-slider-item');        
        //3. 把所有轮播图的最后一张图 克隆一份 添加一个重复的类名
        var firstSlide = $(slideItems[slideItems.length - 1]).clone().addClass('mui-slider-item-duplicate');        
        //4. 往轮播图图片容器的 第一个图片的前面前面添加第一张图
        $('.mui-slider-loop .mui-slider-item:first-child').before(firstSlide);
        //5. 把轮播图的第一张图 克隆一个添加重复类名 
        var lastSlide = $(slideItems[0]).clone().addClass('mui-slider-item-duplicate');
        //6. 把第一张图放到轮播图的最后面
        $('.mui-slider-loop .mui-slider-item:last-child').after(lastSlide);
        //7. 如果要动态添加轮播图那么需要 轮播图加载完毕后再初始化     
        letao.initSlide();
        */
    });

    // 调用查询商品详情的API渲染商品信息
    letao.querProductDetail(id, function (data) {
        // 1. 获取尺寸里面的最小尺码 30-50 使用-分割第一个就是最小尺码  
        let [min, max] = data.size.split('-');

        // 新建一个空数组，把尺码push到这个新数组
        let arr = [];

        for (var i = parseInt(min); i <= max; i++) {
            arr.push(i);
        }

        // 把数组赋值给data.size
        data.newSize = arr;

        let html = template("detailTmp", data);

        $(".product-detail").html(html);

        // 动态添加输入框，也要重新初始化
        mui(".mui-numbox").numbox();

        // 让尺码可以点击
        $(".product-detail").on("tap", ".btn-size", function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    });

    letao.addCart(id);

})

let Letao = function () {

};


Letao.prototype = {
    // 初始化轮播图
    initSlide() {
        // 获得slider插件对象
        var gallery = mui(".mui-slider");
        gallery.slider({
            interval: 1000  // 自动轮播周期，若为0则不自动播放，默认为0
        })
    },

    // 初始化下拉刷新
    initRefreshDown() {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //区域滚动的父容器
                down: {
                    callback: refreshDownCallback
                }
            }
        });
        //下拉刷新的回调函数
        function refreshDownCallback() {
            setTimeout(function () {
                console.log('刷新成功');
                //结束下拉刷新
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            }, 1500)
        }
    },

    // 获取商品详情数据
    querProductDetail(id, callback) {
        // 调用查询商品详情API
        $.ajax({
            url: "/product/queryProductDetail",
            data: { id },
            success(res) {
                typeof callback === "function" && callback(res);
            }
        })
    },

    // 加入购物车
    addCart(id) {
        // 1. 给加入购物车添加点击按钮
        $(".btn-add-cart").on("tap", function () {
            // 2. 获取当前选择的尺码
            const size = $(".btn-size.active").data("size");
            // 3. 判断如果没有选择尺码就是提示选择尺码
            if (!size) {
                mui.toast('请选择尺码', { duration: 'long', type: 'div' });
                return;
            }
            // 4. 获取选择的数量 调用数字框获取取值的函数
            const num = mui(".product-num .mui-numbox").numbox().getValue();
            // 5. 判断当前数量是否选择
            if (num === 0) {
                mui.toast('请选择数量', { duration: 'long', type: 'div' });
                return;
            }
            // 6. 调用加入购物车的API加入购物车
            $.ajax({
                url: "/cart/addCart",
                type: "post",    // 注意提交到数据 是post
                data: { productId: id, num: num, size: size },
                success: function (data) {
                    // 判断如果当前未登录跳转到登录页面
                    if (data.error === 400) {
                        window.location.href = "login.html";
                    }else {
                        // 加入购物车成功提示去购物车查看
                        mui.confirm("加入购物车成功，是否去购物车结算？","温馨提示",["去","不去"],function(e){
                            if(e.index == 0){
                                // 点击了去 跳转到购物车
                                window.location.href = "cart.html";
                            }
                        })
                    }
                }
            })
        })


    }
};


//获取url参数的方法
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
