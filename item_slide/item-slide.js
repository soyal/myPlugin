/**
 * 自定义的轮播类，用于nav小图片的轮播
 * @param selector 选择器
 * @param {object} option navItemWidth:条目宽度;navItemMargin:条目之间的margin;
 * showItemAmount:每页展示的条目数量;duration:动画持续时间,单位是s
 * @constructor
 */
function Slide(selector,option){
    this.$main = $(selector);
    this.option = option;
    this.$prev = this.$main.find("#J-slide-prev");  //上一页按钮
    this.$next = this.$main.find("#J-slide-next");  //下一页按钮
    this.$ul = this.$main.find("#J-slide-ul");
    this.slideType = this.$main.css("transform") === undefined?(this.$main.css("webkitTransform") === undefined?
        "relative":"translate"):"translate";
    this.slideWidth = 0;    //每次滑动的距离
    this.pageSum = 0;    //总页数
    this.curPage = 0;   //当前页数,从0开始
    this.isAnimating = false;   //是否处于动画状态中
    this.duration = option.duration || "0.5";  //每次滑动的持续时间
    this.__init();
}

Slide.prototype.__init = function(){
    var that = this;
    //定义事件
    this.events = {
        "animationAfter" : [],
        "animationBefore" : []
    };
    if(!this.option.navItemWidth){
        throw new Error("请传入navItemWidth,navItemMargin,showItemAmout等必要参数");
    }
    this.slideWidth = this.option.navItemWidth + this.option.navItemMargin ; //滑动宽度 = 条目宽度 + 条目之间距离
    this.pageSum = this.$ul.find("li").length-this.option.showItemAmount + 1;    //总页数
    //用于翻页的初始化
    this.initX();
    //动画初始化
    this.__initTransition();
    //因为一开始的时候肯定是无法翻上一页的，所以隐藏掉上一页按钮
    this.$prev.hide();
    if(this.pageSum == 1){
        this.$next.hide();
    }

    //点击上一页
    this.$prev.click(function(e){
        that.prev();
    });
    //点击下一页
    this.$next.click(function(e){
        that.next();
    });

    //设置鼠标悬停停止播放
    if(!this.option.noHoverStop){
        this.hoverStop();
    }

    //设置动画结束时将isAnimating置为false,适用于css3动画
    //在jQuery中设置isAnimating是在绑定动画的函数中
    this.$ul.on("transitionend",function(){
        that.isAnimating = true;
    })
};
Slide.prototype.__initTransition = function(){
    if(this.$ul.css("transition") !== undefined || this.$ul.css("webkitTransition") !== undefined ){
        this.$ul.css("transition","transform " + this.duration + "s ease-in-out");
    }
};
Slide.prototype.__setTranslateX = function(x){
    this.$ul.css("transform","translateX("+x+"px)");
    this.$ul.css("webkitTransform","translateX("+x+"px)");
};
Slide.prototype.__setLeft = function(x){
    this.$ul.css("left",x + "px");
};

/**
 * 统一setTranslateX,setLeft
 * @param x
 */
Slide.prototype.initX = function(){
    if(this.slideType === "translate"){
        this.__setTranslateX(0);
    }else{
        this.__setLeft(0);
    }
};

Slide.prototype.animateTo = function(x){
    if(this.slideType === "translate"){
        this.__setTranslateX(x);
    }else{
        this.$ul.animate({
            left : x + "px"
        },parseFloat(this.duration)*1000,function(){
            console.log("animation over");
        });
    }
};
/**
 * 用于显示已经隐藏的prev和next
 */
Slide.prototype.showPrevAndNext = function(){
    this.$prev.show();
    this.$next.show();
};

/**
 * 指定页数的翻页函数
 * @param pageNum 指定的页数
 */
Slide.prototype.toPage = function(pageNum){
    if(pageNum > this.pageSum - 1 || pageNum < 0) return;
    var curPos = parseFloat(this.getCurX());
    var targetPos = curPos + parseFloat(this.slideWidth)*(this.curPage - pageNum);
    this.animateTo(targetPos);
    if(this.curPage !== pageNum)
        this.curPage = pageNum;
};

/**
 * 上一页
 */
Slide.prototype.prev = function(){
    if(this.curPage == 0) {
        return false;
    }
    this.showPrevAndNext();
    this.toPage(this.curPage - 1);
    if(this.curPage == 0){
        this.$prev.hide();
    }
};
/**
 * 下一页
 * @param isReset 是否重置，如果传入true,则在滑动到最后一页后下一次调用next会重新回到第一页
 */
Slide.prototype.next = function(isReset){
    if(this.curPage >= this.pageSum-1) {
       if(isReset) this.reset();
        return false;
    }
    this.showPrevAndNext();
    this.toPage(this.curPage + 1);
    if(this.curPage >= this.pageSum-1) {
        this.$next.hide();
    }
};

/**
 * 重置轮播器，将页数归零
 */
Slide.prototype.reset = function(){
    this.animateTo(0);
    this.curPage = 0;
    this.showPrevAndNext();
    this.$prev.hide();
};
/**
 * 获取当前的translateX的值
 */
Slide.prototype.__getCurrentX = function(){
    var pattern = /matrix\(\s*\d,\s*\d,\s*\d,\s*\d,\s*(-?\d+),\s*\d\)/;
    var style = this.$ul.css("transform") || this.$ul.css("webkitTransform");
    var matches = pattern.exec(style);
    return matches[1];
};
/**
 * 获取当前的left的值
 */
Slide.prototype.__getCurrentLeft = function(){
    var style = this.$ul.css("left");
    var pattern = /(\s*-?\d+)px/;
    var matches = pattern.exec(style);
    return matches[1];
};

/**
 * 统一接口，获取当前的位置
 */
Slide.prototype.getCurX = function(){
    if(this.slideType === "translate"){
        return this.__getCurrentX();
    }else{
       return this.__getCurrentLeft();
    }
};

/**
 * 轮播的自动播放
 * @param interval 自动滚动的时间间隔，单位：ms
 */
Slide.prototype.autoPlay = function(interval){
    if(!this.interval && !interval) throw new Error("请输入自动播放的时间间隔");
    if(!this.interval) this.interval = interval;
    var that = this;
    var play = function(){
        that.next(true);
        that.timer = setTimeout(play,that.interval);
    };
    this.timer = setTimeout(play,that.interval);

};

/**
 * 当鼠标悬浮于轮播器上时停止轮播
 */
Slide.prototype.hoverStop = function(){
    var that = this;
    this.$main.hover(function(){
        clearTimeout(that.timer);
    },function(){
        that.autoPlay();
    });
};

/**
 * 清除自动播放的定时器
 */
Slide.prototype.clearTimer = function(){
    if(this.timer){
        clearTimeout(this.timer);
    }
};

Slide.prototype.trigger = function(){

};
/************************实例****************************/
var slide = new Slide("#J-baba-slide",{
    navItemWidth : 210,
    navItemMargin : 15,
    showItemAmount : 4,
    duration : "0.8"
});
slide.autoPlay(5000);
