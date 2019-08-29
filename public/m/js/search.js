$(function(){
    var letao = new Letao();

    // 调用添加历史记录的方法
    letao.addHistory();
    // 调用查询历史记录的方法
    letao.queryHistory();
    // 调用删除历史记录的方法
    letao.removeHistory();
    // 调用清空历史记录方法
    letao.clearHistory()
})

var Letao = function(){

}

Letao.prototype = {
    // 添加历史记录
    addHistory: function() {
        // 1. 给搜索按钮添加点击事件
        const that = this;
        $(".btn-search").on("tap",function(){
            // 2. 获取搜索框输入的内容
            var search = $(".search-input").val();
            
            // 判断是否为空字符串
            if(!search.trim()){
                mui.toast('请输入关键字',{ duration:'long', type:'div' }) 
                return;
            }
            
            // 3. 先去本地存储中拿到之前已近存储了的数组
            // 如果有数组就拿之前字符串转成数组用这个之前的数据push
            // 如果之前没有数据 就用空数组
            
            var searchData = JSON.parse(window.localStorage.getItem("searchLog")) || [];
            // 当localStorage没该键值对时，得到的是null,JSON.parse(null)得到也是null

            // 4. 定义id 唯一标识每一条数据
            var id = 1;
            // 判断localStorage的数组是否已经有内容，长度大于0就认为有内容
            if(searchData.length > 0){
                // 6. 如果数组已经有记录 就使用数组最后一个值的id+1
                id = searchData[searchData.length-1].id + 1;

                // 7-13. 利用数组的filter方法，在数组有内容时才筛选重复内容
                searchData = searchData.filter(function(item,index){
                    if(item.search === search){
                        console.log(item);
                        return false;
                    }else {
                        return true;
                    }
                })
            }

            // 14. 将新的记录对象push进数组
            searchData.push({search:search,id:id})

            // 转成json字符串
            var jsonSearchData = JSON.stringify(searchData);

            // 保存到localStorage中
            window.localStorage.setItem("searchLog",jsonSearchData)

            // 15. 当前添加完成后也要查询历史记录
            that.queryHistory();
            // 16. 点击搜索要跳转到商品列表
            window.location.href = "productlist.html?search=" + search;
   
        })
    },
    // 查询搜索历史记录
    queryHistory: function() {
        // 1.获取本地的存储的数组
        var searchData = window.localStorage.getItem("searchLog");
        // 2. 判断获取本地的字符串是否有长度 认为是有数组
        if(searchData){
            // 3. 字符串有内容就把字符串转成数组
            searchData = JSON.parse(searchData);
        }else {
            // 4. 如果字符串长度等于0 表示之前没有数组 默认为空宿主
            searchData = [];
        }

        // const searchData = JSON.stingify(window.localStorage.get) || []
        // 5.调用模板方法生成html
        var html = template("searchListTmp",{"rows": searchData.reverse()});
        // 6. 把模板放到content里面
        $(".content").html(html);
    },
    // 删除历史记录
    removeHistory: function() {
        const that = this;
        // 1. 给所有的x添加点击事件
        $(".content").on("tap",".btn-delete",function(){
            // 2. 获取当前点击的x对应的要删除的id
            var  id = $(this).parent().data("id");
            // 3. 获取本地的存储的数组
            var searchData = window.localStorage.getItem("searchLog");
            // 5. 判断获取本地存储的字符串是否有长度 认为是有数组
            if(searchData) {
                // 5. 字符串有内容就把字符串转成数组
                searchData = JSON.parse(searchData);
            }else {
                // 6. 如果字符串长度等于0 就表示之前没有数组 默认为空数组
                searchData = [];
            }
            // 7. 循环判断当前id是否和数组中有相同的id
            for(var i = 0;i < searchData.length;i++){
                if(searchData[i].id == id){
                    // 8. 把数组中当前元素删除 splice第一个参数是要删除的下标 第二个要删几个
                    searchData.splice(i,1);
                }
            }
            // 9. 删除完成后把当前数组转成字符串存储本地存储中
            window.localStorage.setItem("searchLog",JSON.stringify(searchData));
            // 10. 当前删除完成后也要查询
            that.queryHistory();

            // ------------------------------------------------------------------------
            // 能被点击，说明localStorage有内容
            // var id = $(this).parent().data("id");
            // var searchData = window.localStorage.setItem("searchLog");
            // serachData = searchData.filter(function(item){
            //     if(item.id === id){
            //         return false;
            //     }else {
            //         return true;
            //     }
            // });
            // window.localStorage.setItem("searchLog",searchData);
            // that.queryHistory()

        })
    },
    clearHistory: function() {
        var that = this;
        // 1. 给清空按钮添加单击事件
        $(".btn-clear").on("tap",function(){
            // 2. 把本地存储清空
            window.localStorage.setItem("searchLog",'[]');
            // 3. 调用查询重新渲染
            that.queryHistory();
        })
    }


}