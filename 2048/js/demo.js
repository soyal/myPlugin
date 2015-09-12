var box_array = [[],[],[],[]];//一个二位数组，用于记录方块行为

//规则
var rule = {
    initCoumt : 2,//方块初始化数量
    addCount : 1//方块每次增加数量
};
var $container = $("#container");//游戏棋盘

initGame();


//按键事件
$(function() {
    $(document).on("keyup",function(e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37:
                moveTo({
                    direction:"left"
                });
                break;
            case 38:
                moveTo({
                    direction:"top"
                });
                break;
            case 39:
                moveTo({
                    direction:"right"
                });
                break;
            case 40:
                moveTo({
                    direction:"bottom"
                });
                break;
            default :
                return false;
        }
    });
});

//Box构造函数
function Box(value) {
    this.value = value;
}

//初始化游戏
function initGame() {
    randomGenerate(rule.initCoumt);//初始化，首先出现若干随机方块
    drawBoxes();
}

//根据box_array绘制方块
function drawBoxes() {
    for(var row=0;row<box_array.length;row++) {
        for(var col=0;col<box_array.length;col++) {
            if(box_array[row][col] != undefined) {
                console.log(row);
                console.log(col);
                var pos = positionSwitch({
                    row : row,
                    col : col
                });
                var $div = $("<div></div>");
                var num = Math.log(box_array[row][col].value)/Math.log(2);//换底公式,求2的对数
                $div.addClass("c"+num)
                    .css("left",pos.left)
                    .css("top",pos.top)
                    .text(box_array[row][col].value);
                $container.append($div);
            }

        }
    }
}

//坐标转换函数，用于映射数组到界面
function positionSwitch(obj) {//obj{row:xx,col:xx}row,col从0开始
    return {
      left : obj.col*110+10+"px",
      top : obj.row*110+10+"px"
    };
}


//随机生成方块函数,自动记录在box_array中
function randomGenerate(amount) {//参数为生成数量
    for(var i= 0,length=amount;i<length;i++) {
        var n1 = Math.floor(Math.random()*4);
        var n2 = Math.floor(Math.random()*4);
        while(box_array[n1][n2] != undefined) {
            n1 = Math.floor(Math.random()*4);
            n2 = Math.floor(Math.random()*4);
        }
        box_array[n1][n2] = new Box(Math.round(Math.random()) == 1?4:2);
        console.log(n1);
        console.log(n2);
    }
}

//移动函数
function moveTo(obj) {
    var dire = obj.direction;
    switch (dire) {
        case "left":
            alert("left");
            break;
        case "top":
            //
            break;
        case "right":
            //
            break;
        case "bottom":
            //
            break;
        default :
            return false;
    }
}

