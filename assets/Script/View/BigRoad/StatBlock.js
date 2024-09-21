/*
功能：统计区块
说明：
*/
var CONSTANTS = require("Constants");
const EVENT = require("Event");
var EventManager = require("EventManager");
const EnumDefine = require("EnumDefine");
var BigRoad = require("BigRoad");

cc.Class({
    extends: cc.Component,

    properties: {
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
    },

    onLoad() {
        this.update_cnt();
        this.scheduleOnce(function () {
            this.draw();
        }.bind(this), 0.1);

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
        ]
        var event_handle = [
            this.onEventBigRoadUpdateCnt.bind(this),
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

        var node_space = 230;
        var x_space = 5;
        var node_prefab = window.app.resManager.get_prefab(CONSTANTS.PREFAB_BANKER);

        //庄
        banker_node = cc.instantiate(node_prefab);
        banker_node.x = left_x + node_space - 120;
        banker_node.y = 0;
        banker_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.BANKER);
        this.node.addChild(banker_node, 10);
        this.label_banker_cnt.node.x = banker_node.x + banker_node.width / 2 + x_space;

        //闲
        player_node = cc.instantiate(node_prefab);
        player_node.x = banker_node.x + node_space;
        player_node.y = 0;
        player_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.PLAYER);
        this.node.addChild(player_node, 10);
        this.label_player_cnt.node.x = player_node.x + player_node.width / 2 + x_space;

        //和
        tie_node = cc.instantiate(node_prefab);
        tie_node.x = player_node.x + node_space;;
        tie_node.y = 0;
        tie_node.getComponent('PrefabBanker').setResult(EnumDefine.AREA_TYPE.TIE);
        this.node.addChild(tie_node, 10);
        this.label_tie_cnt.node.x = tie_node.x + tie_node.width / 2 + x_space;

        //庄对闲对
        var label_width = 300;
        this.label_banker_pair_cnt.node.x = this.label_tie_cnt.node.x + label_width / 2 + x_space;
        this.label_player_pair_cnt.node.x = this.label_banker_pair_cnt.node.x + label_width / 2 + x_space;
    },
    //更新个数
    update_cnt() {
        var stat = BigRoad.stat_cnt();
        var total_cnt = BigRoad.total_node_cnt();
        this.label_total_cnt.string = "Total " + BigRoad.total_node_cnt();
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
});
