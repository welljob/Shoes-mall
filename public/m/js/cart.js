$(function () {
    const letao = new Letao();
    // 调用查询商品的方法 传入需要的参数和回调函数
    letao.queryCart({
        page: 1,
        pageSize: 5
    }, function (data) {
        let html = template("cartTmp", data);
        $(".cart-list").html(html);
    })
    // 调用初始化下拉刷新和上拉加载更多
    letao.initRefreshDownUp();

    // 初始化商品编辑
    letao.editCart();
    // 调用删除购物车
    letao.deleteCart();
    // 调用计算总金额方法
    letao.getSum();

    $('.fa-refresh').on("tap", function () {
        letao.queryCart({
            page: 1,
            pageSize: 5
        }, function (data) {
            const html = template("cartTmp", data);
            $(".cart-list").html(html);
        })
    })
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
            beforeSend: function () {
                $(".loading").show();
            },
            success: function (data) {
                $(".loading").hide();
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
            setTimeout(function () {
                // 1. 调用获取购物车数据的方法
                that.queryCart({
                    page: 1,
                    pageSize: 5
                }, function (data) {
                    let html = template("cartTmp", data);
                    $(".cart-list").html(html);
                    mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                    // 重置page 为1
                    page = 1;
                    // 重置上拉加载效果
                    mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                })
            }, 1500)
        }

        // 3. 上拉加载更多的回调函数
        function refreshUpCallback(argument) {
            setTimeout(function () {
                that.queryCart({
                    page: ++page,
                    pageSize: 5
                }, function (data) {
                    // 判断返回的数据是否为一个数组 为数组 表示没有数据 返回不是数组 表示一个对象 表示有数据
                    // (data instanceof Array)  是一个表达式 要系括号包起来
                    if (!(data instanceof Array)) {
                        let html = template("cartTmp", data);
                        // 上拉加载更多的时候要去追加
                        $(".cart-list").append(html);
                        // 结束上拉加载更多
                        mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh();
                    } else {
                        // 结束上拉加载更多 并且提示没有更多数据了
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                    }
                })
            }, 1500)
        }
    },
    // 3. 编辑购物车
    editCart: function () {
        const that = this;
        $(".cart-list").on("tap", ".btn-edit", function () {
            // 1. 获取当前要编辑的商品（包含了商品的所有信息）
            // 但是要注意只能使用template-web模板才能绑定复杂类型的数据 对象数组等
            let product = $(this).parent().data("product");
            // 2. 获取尺码里面的最小尺码 30-50 使用-分割第一个就是最小尺寸
            let min = product.productSize.split("-")[0];
            // 3. 获取尺码里面的最大尺码使用-分割第二个就是最大尺码
            let max = product.productSize.split("-")[1];
            // 4. 定义一个空数组
            const arr = [];
            // 5. 循环从最小开始 到最大
            for (let i = parseInt(min); i <= max; i++) {
                // 6. 把每个尺码都添加到数组肿
                arr.push(i);
            }
            // 7. 把数组赋值给product对象
            product.proSize = arr;
            // 8. 调用编辑商品的模板 传入当前product
            // 9. 使用正则把html里面回车和换行去掉
            const html = template("editCartTmp", product).replace(/[\r\n]/g, "");
            // 10. 准备需要编辑的模板 编辑尺码 和数量的模板(和详情一样)
            mui.confirm(html, '商品编辑', ['确定', '取消'], function (e) {
                // 13. 判断当前是否点击确定
                if (e.index === 0) {
                    // 14. 获取当前最新选中的尺码和数量
                    let size = $(".btn-size.active").data("size");
                    let num = mui(".mui-numbox").numbox().getValue();
                    // 15. 调用更新购物车的API实现编辑
                    $.ajax({
                        url: "/cart/updateCart",
                        type: "post",
                        data: { id: product.id, size: size, num: num },
                        beforeSend: function () {
                            $(".loading").show();

                        },
                        success: function (data) {
                            $(".loading").hide();

                            // 16. 判断如果成功
                            if (data.success) {
                                // 17. 重新渲染购物车
                                that.queryCart({
                                    page: 1,
                                    pageSize: 5
                                }, function (data) {
                                    const html = template("cartTmp", data);
                                    $(".cart-list").html(html);
                                })
                            }
                        }
                    })
                }
            });

            // 11. 由于数字框也是要动态添加也需要初始化
            mui(".mui-numbox").numbox();

            // 12. 让尺码可以点击
            $(".btn-size").on("tap", function () {
                $(this).addClass("active").siblings().removeClass("active");

            });
        });
    },


    // 4. 删除购物车商品
    deleteCart: function () {
        const that = this;
        // 1. 给所有删除按钮添加点击事件
        $(".cart-list").on("tap", ".btn-delete", function () {
            // 2. 获取当前需要删除的商品
            const id = $(this).parent().data("product").id;
            // 3. 调用删除API实现删除
            $.ajax({
                url: "/cart/deleteCart",
                data: { id: id },
                beforeSend: function () {
                    $(".loading").show();
                },
                success: function (data) {
                    $(".loading").hide();
                    // 16. 判断如果成功
                    if (data.success) {
                        // 17. 重新渲染购物车
                        that.queryCart({
                            page: 1,
                            pageSize: 5
                        }, function (data) {
                            const html = template("cartTmp", data);
                            $(".cart-list").html(html);
                        })
                    }
                }
            })
        })
    },


    // 5. 计算总金额
    getSum: function () {
        // 1. 给所有复选框添加change事件 复选框选中发生更改就触发的事件
        $(".cart-list").on("change", 'input[type="checkbox"]', function () {
            // 2. 获取所有被选中的复选框
            const selected = $("input[type='checkbox']:checked");
            // 定义一个所有商品总价
            var sum = 0;
            // 3. 循环遍历每个选中的复选框
            selected.each(function (index, ele) {
                // 4. 获取当前点击的复选框所在的商品的价格和数量
                let price = $(ele).data("price");
                let num = $(ele).data("num");
                // 5. 每个商品的价格等单价*数量
                let productPrice = price * num;
                // 6. 把商品价格累加
                sum += productPrice;
            });
            // 7. 保留2位小数
            sum = sum.toFixed(2);
            // 8. 把总和放到总价的spna
            $('.total').html(sum);

        })
    },
}