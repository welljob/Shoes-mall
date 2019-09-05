$(function () {
    var letao = new LETAO();
    //调用查询用户的方法
    letao.queryTopCategory(1, 5);
    letao.addFirstCategory();

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
    // 分页函数
    page: function (data) {
        let that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: data.page, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: Math.ceil(data.total / data.size), //总页数
            shouldShowPage: true, //是否显示该按钮
            // useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                //点击的时候调用查询列表API传入对应点击的页码数
                that.queryTopCategory(page, 5);
            }
        })
    }
}