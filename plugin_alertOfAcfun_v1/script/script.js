$(function() {

    var $button = $("button").eq(0);
    var $button2 = $("button").eq(1);
    var $area_info = $(".area-info");
    $button.click(function() {
        //如果警告条数大于5，清除最顶上的警告
        if($area_info.find("li").length > 5) {
            $area_info.find("li").eq(0).remove();
        }

        var $li = $("<li></li>");
        //添加内容
        $li.addClass("info-item")
            .addClass("hide")
            .text("正处于评论不应期")
            .prepend("<i>&laquo;</i>");
        $area_info.append($li);

        //为了实现css3的动画效果
        setTimeout(function() {
            $li.removeClass("hide");
        },100);

        //定时删除警告
        setTimeout(function() {
            clearInfo($li);
        },3000);
    });

    //清除警告（动画效果）,参数是jQuery对象
    function clearInfo($li) {
        if($li.length == 1) {
            $li.addClass("hide");
            setTimeout(function() {
                $li.remove();
            },500);
        }
    }

});