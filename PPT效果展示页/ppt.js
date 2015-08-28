//ppt翻页插件
+function($) {
    $.fn.extend({
        turnPage : function(pageNum) {
            //给导航目录添加样式
            $(".index").find("li")
                .eq(pageNum).addClass("active")
                .siblings().removeClass("active");
            //翻页
            this.eq(pageNum).removeClass("up").addClass("show")
                .prevAll().addClass("up").end().nextAll().removeClass("up")
                .end().siblings().removeClass("show");
            return this;
        },
        nextPage : function() {
            var now = this.index(this.filter(".show"));
            var next = 0;
            if(now != this.length-1) {
                next = now + 1;
            }
            this.turnPage(next);
            return this;
        },
        prevPage : function() {
            var now = this.index(this.filter(".show"));
            var prev = this.length - 1;
            if(now != 0) {
                prev = now - 1;
            }
            this.turnPage(prev);
            return this;
        }
    });
}(jQuery);
//添加jQuery对鼠标滚轮事件的支持
+function($) {
    $.fn.extend({
        //添加滚轮事件
        mousewheel : function(func) {
            var ms = window.onmousewheel;
            //在支持onmousewheel的浏览器中
            if(typeof ms == "object") {
                this.get(0).addEventListener("mousewheel",func,false);
            } else {
                this.get(0).addEventListener("DOMMouseScroll",func,false);
            }
            return this;
        }
    });
}(jQuery);
//获取滚轮滚动值
+function($) {
    $.extend({
        getDelta : function(e) {
            if(e.wheelDelta) {
                return e.wheelDelta;
            } else if(e.detail) {
                return -e.detail*40;
            }
        }
    });
} (jQuery);


//初始化
$(function() {
    var $pageContent = $("#pageContent");
    var $index = $(".index");
    var $pages = $(".page");

    //初始化PPT页面
    $pages.each(function(index,element) {
        $(element).css("z-index",$pages.length-index);
    });
    $index.find("li").eq(0).addClass("active");
    $index.css("margin-top","-"+$index.height()/2+"px");
    //添加点击事件
    $index.click(function(event) {
        var $target = $(event.target);
        var index = $index.find("li").index(event.target);
        if(index > -1) {
            $pages.turnPage(index);
        }
    });
    //添加导航目录提示
    $index.find("li").on("mouseenter",function(e) {
        var index = $index.find("li").index(this);
        if(index>-1) {
            var $this = $(this);
            var tip = "<span class='tip'>"+$this.attr("data-title")+"</span>";
            $this.append(tip);
            var $tip = $("#pageContent .tip");
            $tip.css("display","block").css("left","20px").css("top","-7px");
        }
    }).on("mouseleave", function (e) {
        $(".tip").remove();
    });
    //添加滚轮事件
    var scrollTime = null;
    $(document).mousewheel(function(e) {
        if($.getDelta(e) < 0) {
            window.clearTimeout(scrollTime);
            var that = $pages;
            scrollTime = window.setTimeout($pages.nextPage.bind(that),100);
        } else {
            window.clearTimeout(scrollTime);
            var that = $pages;
            scrollTime = window.setTimeout($pages.prevPage.bind(that),100);
        }
    });
});


