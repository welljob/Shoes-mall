$(function () {
    var letao = new Letao();
    //调用查询用户的方法
    letao.querySecondCategory(1, 5);
    letao.addSecondCategory();
})

var Letao = function () {

}


Letao.prototype = {
    //查询一级分类列表
    querySecondCategory: function (page, pageSize) {
        var that = this;
        // 1. 调用获取用户信息的API
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            data: { page: page || 1, pageSize: pageSize || 5 },
            success: function (data) {
                var html = template('secondCategoryTmp', data);
                $('.user-info tbody').html(html);
                //调用分页的函数
                that.page(data);
            }
        })
    },
    // 添加二级分类
    addSecondCategory: function () {
        var that = this;
        // 1. 给添加品牌添加点击事件
        $('.btn-add-brand').on("click", function () {
            // 2. 请求一级分类的数据 渲染下拉框
            $.ajax({
                url: '/category/queryTopCategoryPaging',
                data: { page: 1, pageSize: 10 },
                success: function (data) {
                    // 3. 渲染下拉框的option
                    var html = template('selectTmp', data);
                    console.log(html);
                    // 4. 把html放到select标签里面
                    $('#selectFirstCategory').html(html);
                }
            });
            // 2. 给文件选择框添加changed事件
            $("#brandImgFile").on("change", function () {
                console.log($(this).val());
                var imgSrc = '/mobile/images/';
                var imgName = $(this).val().split("\\");
                imgSrc += imgName[imgName.length - 1];
                console.log(imgSrc);
                // 把页面的图片路径换成当前imgSrc
                $(".brand-img").attr("src", imgSrc);
            })
            // 4. 给保存按钮添加点击事件
            $(".btn-save").on("click", function () {
                // 1. 获取选择一级分类
                var categoryId = $("#selectFirstCategory").val();
                // 2. 获取品牌名称
                var brandName = $(".brand-name").val();
                // 3. 获取图片的距离
                var brandLogo = $("brand-img").attr("src");
                // 4. 调用API请求添加二级分类
                $.ajax({
                    url: '/category/addSecondCategory',
                    type: "post",
                    data: { brandName: brandName, brandLogo: brandLogo, categoryId: categoryId, hot: 1 },
                    success: function (data) {
                        if (data.success) {
                            that.querySecondCategory(1, 5);
                        }
                    }
                })
            })
        })
    },
    //分页函数
    page: function (data) {
        console.log(data);
        var that = this;
        //初始化分页
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
                that.querySecondCategory(page, 5);
            }
        });
    }


}