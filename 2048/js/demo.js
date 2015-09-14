var box_array = [];//一个二位数组，用于记录方块行为
var row_count = 4;
var col_count = 4;
var animationTime = 100;//毫秒
var isOperating = false;//是否正在执行操作，用于处理在方块移动过程中进行操作的问题

function init_box_array() {
    for(var _i=0;_i<row_count;_i++) {
        box_array[_i] = [];
    }
    for(var _j=0;_j<box_array.length;_j++) {
        for(var _k=0;_k<col_count;_k++) {
            box_array[_j][_k] = null;
        }
    }
}
function init_container() {
    $container.find("div").remove();
}


//规则
var rule = {
    initCoumt : 2,//方块初始化数量
    addCount : 1,//方块每次增加数量
    detect : function(pos,direction,hasMerged) {//pos为BOX在二维数组中的坐标，参数direction{dire : "left"||"right"||"top"||"bottom"}
        var result = {};//用于存放返回结果
        switch (direction.dire) {
            case "left" :
                for(var col=pos.col-1;col>=0;col--) {
                    //如果左边某位置有方块
                    if(box_array[pos.row][col] != undefined) {
                        //且该方块的值等于移动中的方块
                        if(box_array[pos.row][col].value == box_array[pos.row][pos.col].value&&hasMerged == false) {
                            result.action = "merge";//合并
                            result.target = {
                                row : pos.row,
                                col : col
                            };
                        //值不相等
                        }else {
                            //如果要移动的位置与原来相同
                            if(pos.col == col+1) {
                                result.action = "none";//不做任何处理
                                result.target = {
                                    row: -1,
                                    col: -1
                                };
                            } else {
                                result.action = "move";//行为为移动
                                result.target = {
                                    row : pos.row,
                                    col : col+1
                                };
                            }
                        }
                    return result;
                    //左边没有方块
                    } else {
                        //如果该列已经是最后一列，移动到最左端
                        if(col == 0) {
                            result.action = "move";//行为为移动
                            result.target = {
                                row : pos.row,
                                col : 0
                            }
                            return result;
                        }

                    }

                }
                return {action : "none"};
                break;
            case "top" :
                for(var row=pos.row-1;row>=0;row--) {
                    //如果上边某位置有方块
                    if(box_array[row][pos.col] != undefined) {
                        //且该方块的值等于移动中的方块
                        if(box_array[row][pos.col].value == box_array[pos.row][pos.col].value&&hasMerged == false) {
                            result.action = "merge";//合并
                            result.target = {
                                row : row,
                                col : pos.col
                            };
                        //值不相等
                        }else {
                            //如果要移动的位置与原来相同
                            if(pos.row == row+1) {
                                result.action = "none";//不做任何处理
                                result.target = {
                                    row: -1,
                                    col: -1
                                };
                            } else {
                                result.action = "move";//行为为移动
                                result.target = {
                                    row : row+1,
                                    col : pos.col
                                };
                            }
                        }
                        return result;
                    //上边没有方块
                    } else {
                        //如果该行已经是最后一行，移动到最顶端
                        if(row == 0) {
                            result.action = "move";//行为为移动
                            result.target = {
                                row : 0,
                                col : pos.col
                            }
                            return result;
                        }

                    }

                }
                return {action : "none"};
                break;
            case "right":
                for(var col=pos.col+1;col<col_count;col++) {
                    //如果右边某位置有方块
                    if(box_array[pos.row][col] != undefined) {
                        //且该方块的值等于移动中的方块
                        if(box_array[pos.row][col].value == box_array[pos.row][pos.col].value&&hasMerged == false) {
                            result.action = "merge";//合并
                            result.target = {
                                row : pos.row,
                                col : col
                            };
                            //值不相等
                        }else {
                            //如果要移动的位置与原来相同
                            if(pos.col == col-1) {
                                result.action = "none";//不做任何处理
                                result.target = {
                                    row: -1,
                                    col: -1
                                };
                            } else {
                                result.action = "move";//行为为移动
                                result.target = {
                                    row : pos.row,
                                    col : col-1
                                };
                            }
                        }
                        return result;
                        //左边没有方块
                    } else {
                        //如果该列已经是最后一列，移动到最右端
                        if(col == col_count-1) {
                            result.action = "move";//行为为移动
                            result.target = {
                                row : pos.row,
                                col : col_count-1
                            }
                            return result;
                        }

                    }

                }
                return {action : "none"};
                break;
            case "bottom" :
                for(var row=pos.row+1;row<row_count;row++) {
                    //如果下边某位置有方块
                    if(box_array[row][pos.col] != undefined) {
                        //且该方块的值等于移动中的方块
                        if(box_array[row][pos.col].value == box_array[pos.row][pos.col].value&&hasMerged==false) {
                            result.action = "merge";//合并
                            result.target = {
                                row : row,
                                col : pos.col
                            };
                            //值不相等
                        }else {
                            //如果要移动的位置与原来相同
                            if(pos.row == row-1) {
                                result.action = "none";//不做任何处理
                                result.target = {
                                    row: -1,
                                    col: -1
                                };
                            } else {
                                result.action = "move";//行为为移动
                                result.target = {
                                    row : row-1,
                                    col : pos.col
                                };
                            }
                        }
                        return result;
                        //下边没有方块
                    } else {
                        //如果该行已经是最后一行，移动到最下端
                        if(row == row_count-1) {
                            result.action = "move";//行为为移动
                            result.target = {
                                row : row_count-1,
                                col : pos.col
                            }
                            return result;
                        }

                    }

                }
                return {action : "none"};
                break;
            default  :
                return false;
        }
    }
};
var $container = $("#container");//游戏棋盘



//按键事件
$(function() {
    $("#start").click(function() {
        initGame();
        $(this).text("Restart!");

    });
    $("#again").click(function() {
        $("#mask").animate({
            opacity: 0
        },200,function() {
            $("#mask").css("display","none");
            initGame();
            $("#start").text("Restart!");
        });
    });
    $(document).on("keyup",function(e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37:
                if(!isOperating)
                moveTo({
                    direction:"left"
                });
                break;
            case 38:
                if(!isOperating)
                moveTo({
                    direction:"top"
                });
                break;
            case 39:
                if(!isOperating)
                moveTo({
                    direction:"right"
                });
                break;
            case 40:
                if(!isOperating)
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
    init_box_array();//初始化数组
    init_container();//初始化界面
    //var array = randomGenerate(rule.initCoumt);//初始化，首先出现若干随机方块
    //drawBoxes(array);
    generate([{
        row : 0,
        col : 0,
        value : 4
    },{
        row : 1,
        col : 0,
        value : 4
    }]);
}

//绘制方块
function drawBoxes(array) {
        for(var i= 0,length = array.length;i<length;i++) {
            if(box_array[array[i].row][array[i].col] != undefined) {
               // console.log(row);
               // console.log(col);
                var pos = positionSwitch(array[i]);
                var $div = $("<div></div>");
                var num = Math.log(box_array[array[i].row][array[i].col].value)/Math.log(2);//换底公式,求2的对数
                $div.addClass("c"+num)
                    .css("left",pos.left)
                    .css("top",pos.top)
                    .attr("data-row",array[i].row)
                    .attr("data-col",array[i].col)
                    .text(box_array[array[i].row][array[i].col].value);
                $container.append($div);
            }

        }
        var length = getAllBlank().length;
        //是否失败判断
        if(length == 0) {
            if(isDefeat()) {
                $("#mask").css("display","block").animate({
                    opacity : 0.8
                },200);
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
    var array = [];
    for(var i= 0,length=amount;i<length;i++) {
        var blank_array = getAllBlank();
        var random = getRandomNum(blank_array.length);
        box_array[blank_array[random].row][blank_array[random].col] = new Box(Math.round(Math.random()) == 1?4:2);
        //console.log(n1);
        // console.log(n2);
        array.push({
            row : blank_array[random].row,
            col : blank_array[random].col
        });
       // console.log(blank_array.length);
    }
    return array;
}

//获取[0,n)的随机整数
function getRandomNum(n) {
    return Math.floor(Math.random()*n);
}

//获取所有空位的信息
function getAllBlank() {
    var blank_array=[];
    for(var row= 0;row<row_count;row++) {
        for(var col=0;col<col_count;col++) {
            if(box_array[row][col] == undefined) {
                blank_array.push({
                    row : row,
                    col : col
                });
            }
        }
    }
    return blank_array;
}

//规定生成特定位置方块
function generate(array) {
    for(var i=0;i<array.length;i++) {
        box_array[array[i].row][array[i].col] = new Box(array[i].value);
    }
    drawBoxes(array);
}

//判断是否游戏失败
function isDefeat() {
    for(var row=0;row<row_count;row++) {
        for(var col=0;col<col_count;col++) {
            if(box_array[row][col]!=undefined) {
                var target_left = rule.detect({
                    row : row,
                    col : col
                },{
                    dire : "left"
                },false);
                var target_top = rule.detect({
                    row : row,
                    col : col
                },{
                    dire : "top"
                },false);
                var target_right = rule.detect({
                    row : row,
                    col : col
                },{
                    dire : "right"
                },false);
                var target_bottom = rule.detect({
                    row : row,
                    col : col
                },{
                    dire : "bottom"
                },false);
                if(canMove(target_left)||canMove(target_top)||canMove(target_right)||canMove(target_bottom)) {
                    return false;
                }
            }

        }
    }
    return true;
}

function canMove(target) {
    return target.action == "merge"||target.action == "move";
}

//移动函数
function moveTo(obj) {

    var dire = obj.direction;
    var available = false;//是否为有效移动
    switch (dire) {
        case "left":
            for(var row=0;row<box_array.length;row++) {
                var hasMerged = false;
                for(var col=1;col<box_array[row].length;col++) {
                    if(box_array[row][col] != undefined) {
                        var obj = {//原对象坐标封装
                            row : row,
                            col : col
                        };
                        var result = rule.detect(obj, {
                                dire :"left"
                            },hasMerged
                        );
                        if(result.action == "merge") {
                            hasMerged = true;
                        }
                        if(operateBox(result,obj))
                            available = true;
                    }
                }
            }
            break;
        case "top":
            for(var col=0;col<col_count;col++) {
                var hasMerged = false;
                for(var row=1;row<row_count;row++) {
                    if(box_array[row][col] != undefined) {
                        var obj = {//原对象坐标封装
                            row : row,
                            col : col
                        };
                        var result = rule.detect(obj, {
                                dire :"top"
                            },hasMerged
                        );

                        if(result.action == "merge") {
                            hasMerged = true;
                        }
                        if(operateBox(result,obj))
                            available = true;
                    }
                }
            }
            break;
        case "right":
            for(var row=0;row<box_array.length;row++) {
                var hasMerged = false;
                for(var col=box_array[row].length-2;col>=0;col--) {
                    if(box_array[row][col] != undefined) {
                        var obj = {//原对象坐标封装
                            row : row,
                            col : col
                        };
                        var result = rule.detect(obj, {
                                dire :"right"
                            },hasMerged
                        );
                        if(result.action == "merge") {
                            hasMerged = true;
                        }
                        if(operateBox(result,obj))
                            available = true;
                    }

                }
            }
            break;
        case "bottom":
            for(var col=0;col<col_count;col++) {
                var hasMerged = false;
                for(var row=row_count-2;row>=0;row--) {
                    if(box_array[row][col] != undefined) {
                        var obj = {//原对象坐标封装
                            row : row,
                            col : col
                        };
                        var result = rule.detect(obj, {
                                dire :"bottom"
                            },hasMerged
                        );
                        if(result.action == "merge") {
                            hasMerged = true;
                        }
                        if(operateBox(result,obj))
                            available = true;
                    }
                }
            }
            break;
        default :
            break;
    }
    //如果是有效移动
    if(available) {
        var array = randomGenerate(1);
        setTimeout(function() {
            drawBoxes(array);
        },animationTime);
    }

}

//判断是否还有空位
function hasBlank() {
    for(var row=0;row<row_count;row++) {
        for(var col=0;col<col_count;col++) {
            if(box_array[row][col] == undefined) {
                return true;
            }
        }
    }
    return false;
}

//将方块移动到特定位置，包括数组中的和界面中的
function moveToPos(obj,target) {//obj,target都为{row:xx,col:xx}
    isOperating = true;
    //移动二维数组中的对象
    box_array[target.row][target.col] = box_array[obj.row][obj.col];
    //删除二维数组中的原对象
    box_array[obj.row][obj.col] = null;
    //移动界面中的对象
    var $obj = $("[data-row="+obj.row+"][data-col="+obj.col+"]");
    var ui_pos = positionSwitch(target);
    $obj.attr("data-row",target.row)
        .attr("data-col",target.col)
        .css("left",ui_pos.left)
        .css("top",ui_pos.top);
    setTimeout(function() {
        isOperating = false;
    },animationTime);
}

//合并函数，用于合并二维数组和界面中的方块
function merge(obj,target) {
    isOperating = true;
    //合并数组中的方块
    var value = box_array[obj.row][obj.col].value*2;
    box_array[target.row][target.col].value = value;
    //删除数组中的原对象
    box_array[obj.row][obj.col] = null;

    //合并界面中的方块
    var $obj = $("[data-row="+obj.row+"][data-col="+obj.col+"]");
    var $target = $("[data-row="+target.row+"][data-col="+target.col+"]");
    var className = getBoxClass(value);
    var ui_pos = positionSwitch(target);
    $obj.attr("data-row",target.row)
        .attr("data-col",target.col)
        .css("left",ui_pos.left)
        .css("top",ui_pos.top);
    //200毫秒后删除目标位置上的方块,改变原方块的样式
    setTimeout(function() {
        $target.remove();
        $obj.text(value);
        $obj.removeClass().addClass(className);
        isOperating = false;
    },animationTime);

}

//获取界面方块的类
function getBoxClass(value) {
    var num = Math.log(value)/Math.log(2);
    return "c" + num;
}

function operateBox(result,obj) {
    switch (result.action) {
        case "merge" :
            merge({
                row : obj.row,
                col : obj.col
            },result.target);
            return true;
            break;
        case "move" :
            moveToPos({
                row : obj.row,
                col : obj.col
            },result.target);
            return true;
            break;
        case "none" :
        //什么也不做
           break;
    }
}
