// 使用zepto和jquery一样 使用入口函数
$(function () {
    // 初始化MUI的轮播图插件
    // 获得slider插件对象
    var gallery = mui(".mui-slider")
    // 调用silder初始化轮播图
    gallery.slider({
        // 自动轮播图的时间间隔
        interval: 1000
    });

    // 初始化区域滚动插件
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
})
// 这是在移动APP里面 会出现引导页 （第一次打开APP显示的一个页面 等待资源加载）
// 事件就是等引导页加载完毕后去执行的事件
// 如果你没设置引导页就无法触发这个事件
// mui.plusReady(function(){

// });