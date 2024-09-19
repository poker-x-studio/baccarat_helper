/*
功能：大路视图
说明：
*/
var CONSTANTS = require("Constants");
var EnumDefine = require("EnumDefine");
var EVENT = require("Event");
var EventManager = require("EventManager");
var BigRoad = require("BigRoad");
var GlobalData = require("GlobalData");

var LINE_CLR = new cc.Color().fromHEX('#DCDCDC');
var LINE_WIDTH = 2;
var LEFT_SPACE = 50;
var RIGHT_SPACE = 50;
var TOP_SPACE = 50;
var BOTTOM_SPACE = 50;

cc.Class({
    extends: cc.Component,

    properties: {
        gride_area: {
            type: cc.Graphics,
            default: null,
            tooltip: "横竖网格区域",
        },
        prefab_index_list: {
            type: [cc.Node],
            default: [],
            tooltip: "大路索引列表",
        },
        prefab_node_list: {
            type: [cc.Node],
            default: [],
            tooltip: "大路节点列表",
        },
    },

    onLoad() {
        this.prefab_index_list = [];
        this.prefab_node_list = [];
        this.eventRegister();
    },
    onDestroy() {
        //事件注销
        this.eventUnregister();
    },

    //事件注册
    eventRegister() {
        this.eventHandler = [];
        var event_name = [
            EVENT.EVENT_NAME_BIG_ROAD_BANKER_NODE,
            EVENT.EVENT_NAME_BIG_ROAD_PLAYER_NODE,
            EVENT.EVENT_NAME_BIG_ROAD_ERASE_NODE,
            EVENT.EVENT_NAME_BIG_ROAD_RESET,
            EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE,
        ]
        var event_handle = [
            this.onEventBigRoadUpdate.bind(this),
            this.onEventBigRoadUpdate.bind(this),
            this.onEventBigRoadEraseNode.bind(this),
            this.onEventBigRoadReset.bind(this),
            this.onEventBigRoadGrideSize.bind(this),
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

    //计算网格区域参数
    cal_gride_area_params(gride_size) {
        //格子宽高
        var gride_width = gride_size.width;
        var gride_height = gride_size.height;

        //理论线宽线高
        var line_width_1 = this.gride_area.node.width - LEFT_SPACE - RIGHT_SPACE;
        var line_height_1 = this.gride_area.node.height - TOP_SPACE - BOTTOM_SPACE;
        //多余的部分
        var x_margin = line_width_1 % gride_width;
        var y_margin = line_height_1 % gride_height;
        //实际线宽线高
        var line_width = line_width_1 - x_margin;
        var line_height = line_height_1 - y_margin;
        //左上起点
        var left_top_point_x = this.gride_area.node.x - this.gride_area.node.width / 2 + LEFT_SPACE + x_margin / 2;
        var left_top_point_y = this.gride_area.node.y + this.gride_area.node.height / 2 - TOP_SPACE - y_margin / 2;

        return { left: left_top_point_x, top: left_top_point_y, gride_width: gride_width, gride_height: gride_height, line_width: line_width, line_height: line_height };
    },

    //绘制网格
    draw_gride() {
        //网格区域参数
        var gride_params = this.cal_gride_area_params(GlobalData.gride_size);

        var ctx = this.gride_area.getComponent(cc.Graphics);
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeColor = LINE_CLR;

        //x轴-x保持不变
        for (var i = 0; i <= gride_params.line_width / gride_params.gride_width; i++) {
            var x = gride_params.left + i * gride_params.gride_width;
            var y1 = gride_params.top;
            var y2 = y1 - gride_params.line_height;
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
        }
        //y轴-y保持不变
        for (var i = 0; i <= gride_params.line_height / gride_params.gride_height; i++) {
            var x1 = gride_params.left;
            var x2 = x1 + gride_params.line_width;
            var y = gride_params.top - i * gride_params.gride_height;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        }
    },
    //绘制索引
    draw_index() {
        //网格区域参数
        var gride_params = this.cal_gride_area_params(GlobalData.gride_size);

        //索引
        var index_prefab = window.app.resManager.get_prefab_bigroad_index();
        //x轴
        for (var i = 0; i <= gride_params.line_width / gride_params.gride_width; i++) {
            //新实例
            var new_node = cc.instantiate(index_prefab);

            new_node.x = gride_params.left + i * gride_params.gride_width;
            new_node.y = gride_params.top + new_node.height / 2;
            new_node.getComponent('PrefabBigRoadIndex').setIndex(i);

            this.gride_area.node.addChild(new_node, 10);
            this.prefab_index_list[this.prefab_index_list.length] = new_node;
        }
        //y轴
        for (var i = 0; i <= gride_params.line_height / gride_params.gride_height; i++) {
            //新实例
            var new_node = cc.instantiate(index_prefab);

            new_node.x = gride_params.left - new_node.width / 2;
            new_node.y = gride_params.top - i * gride_params.gride_height;
            new_node.getComponent('PrefabBigRoadIndex').setIndex(i);

            this.gride_area.node.addChild(new_node, 10);
            this.prefab_index_list[this.prefab_index_list.length] = new_node;
        }
    },
    //绘制节点
    draw_node() {
        //网格区域参数
        var gride_params = this.cal_gride_area_params(GlobalData.gride_size);
        var total_index = 0;
        //大路节点预制件
        var node_prefab = window.app.resManager.get_prefab_bigroad_node();

        for (var i = 0; i < BigRoad.col_cnt(); i++) {
            var col = BigRoad.get_col(i);

            for (var j = 0; j < col.node_cnt(); j++) {
                var node_item = col.get_node(j);

                //新实例
                var new_node = cc.instantiate(node_prefab);

                new_node.x = gride_params.left + (i + 1) * gride_params.gride_width - gride_params.gride_width / 2;
                new_node.y = gride_params.top - (j + 1) * gride_params.gride_height + gride_params.gride_height / 2;
                //缩放
                new_node.scaleX = gride_params.gride_width / new_node.width;
                new_node.scaleY = gride_params.gride_height / new_node.height;

                new_node.getComponent('PrefabBigRoadNode').setResult(total_index, node_item.bet_area, node_item.bet_amount, node_item.result_area);

                this.gride_area.node.addChild(new_node, 10);
                this.prefab_node_list[this.prefab_node_list.length] = new_node;

                total_index += 1;
            }
        }
    },

    //事件处理-更新大路
    onEventBigRoadUpdate(event_name, udata) {
        //需要更新的节点
        var target_index = udata;
        //网格区域参数
        var gride_params = this.cal_gride_area_params(GlobalData.gride_size);
        var total_index = 0;
        //大路节点预制件
        var node_prefab = window.app.resManager.get_prefab_bigroad_node();

        for (var i = 0; i < BigRoad.col_cnt(); i++) {
            var col = BigRoad.get_col(i);

            for (var j = 0; j < col.node_cnt(); j++) {
                var node_item = col.get_node(j);

                if (target_index == total_index) {
                    //新实例
                    var new_node = cc.instantiate(node_prefab);

                    new_node.x = gride_params.left + (i + 1) * gride_params.gride_width - gride_params.gride_width / 2;
                    new_node.y = gride_params.top - (j + 1) * gride_params.gride_height + gride_params.gride_height / 2;
                    //缩放
                    new_node.scaleX = gride_params.gride_width / new_node.width;
                    new_node.scaleY = gride_params.gride_height / new_node.height;

                    new_node.getComponent('PrefabBigRoadNode').setResult(total_index, node_item.bet_area, node_item.bet_amount, node_item.result_area);

                    this.gride_area.node.addChild(new_node, 10);
                    this.prefab_node_list[this.prefab_node_list.length] = new_node;
                }
                total_index += 1;
            }
        }
    },

    //事件处理-撤销节点
    onEventBigRoadEraseNode(event_name, udata) {
        //需要更新的节点
        var target_index = udata;
        var last_node = this.prefab_node_list.pop();
        if (last_node != null) {
            this.gride_area.node.removeChild(last_node);
        }
    },
    //事件处理-清空
    onEventBigRoadReset(event_name, udata) {
        //node
        for (var i = 0; i < this.prefab_node_list.length; i++) {
            var node = this.prefab_node_list[i];
            this.gride_area.node.removeChild(node);
        }
        this.prefab_node_list = [];
    },
    //事件处理-网格size
    onEventBigRoadGrideSize(event_name, udata) {
        var gride_size = udata;
        this.cal_gride_area_params(gride_size);

        var ctx = this.gride_area.getComponent(cc.Graphics);
        ctx.clear();

        //index
        for (var i = 0; i < this.prefab_index_list.length; i++) {
            var node = this.prefab_index_list[i];
            this.gride_area.node.removeChild(node);
        }
        this.prefab_index_list = [];

        //node
        for (var i = 0; i < this.prefab_node_list.length; i++) {
            var node = this.prefab_node_list[i];
            this.gride_area.node.removeChild(node);
        }
        this.prefab_node_list = [];

        //重画
        this.draw_gride();
        this.draw_index();
        this.draw_node();
    },
});
