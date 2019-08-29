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
    letao.querProductDetail(id,function(data){
        // 1. 获取尺寸里面的最小尺码 30-50 使用-分割第一个就是最小尺码  
        let [min,max] = data.size.split('-');

        // 新建一个空数组，把尺码push到这个新数组
        let arr = [];

        for(var i = parseInt(min);i <= max;i++){
            arr.push(i);
        }

        // 把数组赋值给data.size
        data.newSize = arr;

        let html = template("detailTmp",data);

        $(".product-detail").html(html);

        // 动态添加输入框，也要重新初始化
        mui(".mui-numbox").numbox();
    })

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
    }
};


//获取url参数的方法
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
