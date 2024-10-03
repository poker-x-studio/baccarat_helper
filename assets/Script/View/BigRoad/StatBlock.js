/*
功能：统计区块
说明：
*/
const CONSTANTS = require("Constants");
const EVENT = require("Event");
var EventManager = require("EventManager");
const EnumDefine = require("EnumDefine");
var GlobalData = require("GlobalData");
var BigRoad = require("BigRoad");

cc.Class({
    extends: cc.Component,

    properties: {
        layer_stat: {
            type: cc.Node,
            default: null,
            tooltip: "统计层",
        },
        label_total_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "总数",
        },
        label_banker_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "庄个数",
        },
        label_player_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "闲个数",
        },
        label_tie_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "和个数",
        },
        label_banker_pair_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "庄对个数",
        },
        label_player_pair_cnt: {
            type: cc.Label,
            default: null,
            tooltip: "闲对个数",
        },
        label_tip: {
            type: cc.Label,
            default: null,
            tooltip: "提示",
        },
    },

    onLoad() {
        this.update_cnt();
        this.scheduleOnce(function () {
            this.draw();
        }.bind(this), 0.5);

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
            EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT,
            EVENT.EVENT_NAME_BIG_ROAD_TIP,
        ]
        var event_handle = [
            this.onEventBigRoadUpdateCnt.bind(this),
            this.onEventBigRoadTip.bind(this),
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

    //绘制
    draw() {
        var left_x = 50;
        this.label_total_cnt.node.x = left_x;

        var label_total_cnt_space = 300;
        var node_space = 230;
        var x_space = 5;
        var node_prefab = window.app.resManager.get_prefab(CONSTANTS.PREFAB_BANKER);

        //庄
        banker_node = cc.instantiate(node_prefab);
        banker_node.x = left_x + label_total_cnt_space - 120;
        banker_node.y = 0;
        banker_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.BANKER);
        this.layer_stat.addChild(banker_node, 10);
        this.label_banker_cnt.node.x = banker_node.x + banker_node.width / 2 + x_space;

        //闲
        player_node = cc.instantiate(node_prefab);
        player_node.x = banker_node.x + node_space;
        player_node.y = 0;
        player_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.PLAYER);
        this.layer_stat.addChild(player_node, 10);
        this.label_player_cnt.node.x = player_node.x + player_node.width / 2 + x_space;

        //和
        tie_node = cc.instantiate(node_prefab);
        tie_node.x = player_node.x + node_space;;
        tie_node.y = 0;
        tie_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.TIE);
        this.layer_stat.addChild(tie_node, 10);
        this.label_tie_cnt.node.x = tie_node.x + tie_node.width / 2 + x_space;

        //庄对闲对
        var label_width = 300;
        this.label_banker_pair_cnt.node.x = this.label_tie_cnt.node.x + label_width / 2 + x_space;
        this.label_player_pair_cnt.node.x = this.label_banker_pair_cnt.node.x + label_width / 2 + x_space;

        //提示
        this.label_tip.node.x = this.label_total_cnt.node.x;
    },
    //更新个数
    update_cnt() {
        var stat = GlobalData.big_road.stat_cnt();
        var total_cnt = GlobalData.big_road.total_node_cnt();
        this.label_total_cnt.string = "Total Games " + GlobalData.big_road.total_node_cnt();
        if (total_cnt > 0) {
            this.label_banker_cnt.string = "Banker " + stat.banker_cnt + " [" + ((stat.banker_cnt / total_cnt) * 100).toFixed(2) + "%]";
            this.label_player_cnt.string = "Player " + stat.player_cnt + " [" + ((stat.player_cnt / total_cnt) * 100).toFixed(2) + "%]";
            this.label_tie_cnt.string = "Tie " + stat.tie_cnt + " [" + ((stat.tie_cnt / total_cnt) * 100).toFixed(2) + "%]";
            this.label_banker_pair_cnt.string = "庄对 " + stat.banker_pair_cnt + " [" + ((stat.banker_pair_cnt / total_cnt) * 100).toFixed(2) + "%]";
            this.label_player_pair_cnt.string = "闲对 " + stat.player_pair_cnt + " [" + ((stat.player_pair_cnt / total_cnt) * 100).toFixed(2) + "%]";
        } else {
            this.label_banker_cnt.string = "Banker " + stat.banker_cnt;
            this.label_player_cnt.string = "Player " + stat.player_cnt;
            this.label_tie_cnt.string = "Tie " + stat.tie_cnt;
            this.label_banker_pair_cnt.string = "庄对 " + stat.banker_pair_cnt;
            this.label_player_pair_cnt.string = "闲对 " + stat.player_pair_cnt;
        }
    },

    //事件处理-更新个数
    onEventBigRoadUpdateCnt(event_name, udata) {
        this.update_cnt();
    },
    //事件处理-设置提示信息
    onEventBigRoadTip(event_name, udata) {
        var suggestion = udata;
        var total_profit = GlobalData.big_road.profit();
        this.label_tip.string = "预测结果: " + EnumDefine.area_type_2_string(suggestion.bet_area) + ",建议下注额:" + suggestion.bet_amount + ',' + suggestion.comment + ',当前盈利:' + total_profit;
    },
});
