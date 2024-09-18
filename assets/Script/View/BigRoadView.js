/*
功能：大路视图
说明：
*/
var EnumDefine = require("EnumDefine");
var EVENT = require("Event");
var EventManager = require("EventManager");
var BigRoad = require("BigRoad");
var ResManager = require("ResManager");

var LINE_CLR = new cc.Color().fromHEX('#DCDCDC');
var LINE_WIDTH = 2;
var LEFT_SPACE = 50;
var RIGHT_SPACE = 50;
var TOP_SPACE = 20;
var BOTTOM_SPACE = 20;

cc.Class({
    extends: cc.Component,

    properties: {
        grid: {
            type: cc.Graphics,
            default: null,
            tooltip: "横竖网格",
        },
    },

    onLoad() {
        this.eventRegister();
        this.draw_grid();
    },
    onDestroy() {
        //事件注销
        this.eventUnregister();
    },

    //事件注册
    eventRegister() {
        this.eventHandler = [];
        var event_name = [
            EVENT.EVENT_NAME_BANKER,
            EVENT.EVENT_NAME_PLAYER,
        ]
        var event_handle = [
            this.onEventUpdateBigRoad.bind(this),
            this.onEventUpdateBigRoad.bind(this),
        ]

        for (var i = 0; i < event_name.length; i++) {
            var item = {}
            item.handler = event_handle[i];
            item.event_name = event_name[i];
            EventManager.add_listener(item.event_name, item.handler);
            this.eventHandler.push(item)
        }
    },
    //事件注销
    eventUnregister() {
        for (var i = 0; i < this.eventHandler.length; i++) {
            var item = this.eventHandler[i]
            EventManager.remove_listener(item.event_name, item.handler);
        }
        this.eventHandler = []
    },

    //计算网格参数
    cal_grid_params() {
        //格子宽高
        var grid_width = 60;
        var grid_height = 60;

        //理论线宽线高
        var line_width_1 = this.grid.node.width - LEFT_SPACE - RIGHT_SPACE;
        var line_height_1 = this.grid.node.height - TOP_SPACE - BOTTOM_SPACE;
        //多余的部分
        var x_margin = line_width_1 % grid_width;
        var y_margin = line_height_1 % grid_height;
        //实际线宽线高
        var line_width = line_width_1 - x_margin;
        var line_height = line_height_1 - y_margin;
        //左上起点
        var left_top_point_x = this.grid.node.x - this.grid.node.width / 2 + LEFT_SPACE + x_margin / 2;
        var left_top_point_y = this.grid.node.y + this.grid.node.height / 2 - TOP_SPACE - y_margin / 2;

        return { left: left_top_point_x, top: left_top_point_y, grid_width: grid_width, grid_height: grid_height, line_width: line_width, line_height: line_height };
    },

    //绘制网格
    draw_grid() {
        //网格参数
        var grid_params = this.cal_grid_params();

        var ctx = this.grid.getComponent(cc.Graphics);
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeColor = LINE_CLR;

        //x轴-x保持不变
        for (var i = 0; i <= grid_params.line_width / grid_params.grid_width; i++) {
            var x = grid_params.left + i * grid_params.grid_width;
            var y1 = grid_params.top;
            var y2 = y1 - grid_params.line_height;
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
        }
        //y轴-y保持不变
        for (var i = 0; i <= grid_params.line_height / grid_params.grid_height; i++) {
            var x1 = grid_params.left;
            var x2 = x1 + grid_params.line_width;
            var y = grid_params.top - i * grid_params.grid_height;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        }
    },

    //事件处理-更新大路
    onEventUpdateBigRoad(event_name, udata) {
        //需要更新的节点
        var target_index = udata;
        //网格参数
        var grid_params = this.cal_grid_params();
        var total_index = 0;
        //大路节点预制件
        var node_prefab = window.app.resManager.get_prefab_bigroad_node();

        for (var i = 0; i < BigRoad.col_cnt(); i++) {
            var col = BigRoad.get_col(i);

            for (var j = 0; j < col.node_cnt(); j++) {
                var node_item = col.get_node(j);

                if (target_index == total_index) {
                    var new_prefab = cc.instantiate(node_prefab);
                    
                    new_prefab.x = grid_params.left + (i + 1) * new_prefab.width - new_prefab.width / 2;
                    new_prefab.y = grid_params.top - (j + 1) * new_prefab.height + new_prefab.height / 2;

                    new_prefab.getComponent('PrefabBigRoadNode').setResult(total_index, node_item.bet_area, node_item.bet_amount, node_item.result_area);
                    this.grid.node.addChild(new_prefab, 10);
                }
                total_index += 1;
            }
        }
    }
});
