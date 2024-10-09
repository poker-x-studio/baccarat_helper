/*
功能：主视图
说明：
*/
var EnumDefine = require("EnumDefine");
var BigRoad = require("BigRoad");
var EVENT = require("Event");
var EventManager = require("EventManager");
var GlobalData = require("GlobalData");
const CONSTANTS = require("Constants");
var DropDownOptionData = require("DropDownOptionData");

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_banker_pair: {
            type: cc.Node,
            default: null,
            tooltip: "庄对复选框",
        },
        toggle_player_pair: {
            type: cc.Node,
            default: null,
            tooltip: "闲对复选框",
        },
        label_bet_amount: {
            type: cc.Label,
            default: null,
            tooltip: "实际下注额",
        },
        editbox_base: {
            type: cc.Node,
            default: null,
            tooltip: "基础分",
        },
        drop_down_box: {
            type: cc.Node,
            default: null,
            tooltip: "下拉控件-倍数",
        },
        drop_down_box_times: [],    //倍数  
    },

    // use this for initialization
    onLoad: function () {
        console.log(CONSTANTS.TAG, "MainView.onLoad(),");

        this.scheduleOnce(function () {
            EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
        }.bind(this), 0.5);

        //下拉列表控件
        var optionDatas = [];
        this.drop_down_box_times = [0,];

        for (var i = 0; i <= 10; i++) {
            this.drop_down_box_times[this.drop_down_box_times.length] = Math.pow(2, i);
        }
        for (var i = 0; i < this.drop_down_box_times.length; i++) {
            var optionData = new DropDownOptionData();
            optionData.optionString = this.drop_down_box_times[i] + "倍";
            optionDatas[optionDatas.length] = optionData;
        }
        var cmp = this.drop_down_box.getComponent('PrefabDropdownBox');
        cmp.addOptionDatas(optionDatas);
        cmp.setSelectedIndex(0);

        this.resetInputControls();
        //window.app.viewManager.alert("提示框");
        this.eventRegister();
    },
    onDestroy() {
        //事件注销
        this.eventUnregister();
    },

    update: function (dt) {
    },

    //事件注册
    eventRegister() {
        this.eventHandler = [];
        var event_name = [
            EVENT.EVENT_NAME_DROP_DOWN_BOX_SELECTED,
        ]
        var event_handle = [
            this.onEventDropDownBoxSelected.bind(this),
        ]

        for (var i = 0; i < event_name.length; i++) {
            var item = {}
            item.handler = event_handle[i];
            item.event_name = event_name[i];
            EventManager.addListener(item.event_name, item.handler);
            this.eventHandler.push(item)
        }
    },
    //事件注销
    eventUnregister() {
        for (var i = 0; i < this.eventHandler.length; i++) {
            var item = this.eventHandler[i]
            EventManager.removeListener(item.event_name, item.handler);
        }
        this.eventHandler = []
    },

    //庄家
    onClickBanker(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickBanker()");

        //获取输入控件值
        var value = this.getValueFromInputControls();

        var result_area = EnumDefine.AREA_TYPE.BANKER;
        if (value.is_banker_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.BANKER_PAIR;
        }
        if (value.is_player_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.PLAYER_PAIR;
        }
        var bet_amount = value.bet_amount;
        this.resetInputControls();

        //
        var virtul_bet_area = GlobalData.virtual_node.bet_area;
        var node_item = { number: -1, bet_area: virtul_bet_area, bet_amount: bet_amount, result_area: result_area, };
        node_item.number = GlobalData.big_road.totalNodeCnt() + 1;
        GlobalData.big_road.push(node_item);

        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_BANKER_NODE, node_item.number);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT, null);
    },
    //闲家
    onClickPlayer(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickPlayer()");

        //获取输入控件值
        var value = this.getValueFromInputControls();

        var result_area = EnumDefine.AREA_TYPE.PLAYER;
        if (value.is_banker_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.BANKER_PAIR;
        }
        if (value.is_player_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.PLAYER_PAIR;
        }
        var bet_amount = value.bet_amount;
        this.resetInputControls();

        //
        var virtul_bet_area = GlobalData.virtual_node.bet_area;
        var node_item = { number: -1, bet_area: virtul_bet_area, bet_amount: bet_amount, result_area: result_area, };
        node_item.number = GlobalData.big_road.totalNodeCnt() + 1;
        GlobalData.big_road.push(node_item);

        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_PLAYER_NODE, node_item.number);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT, null);
    },
    //和
    onClickTie(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickTie()");

        //获取输入控件值
        var value = this.getValueFromInputControls();

        var result_area = EnumDefine.AREA_TYPE.TIE;
        if (value.is_banker_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.BANKER_PAIR;
        }
        if (value.is_player_pair) {
            result_area = result_area | EnumDefine.AREA_TYPE.PLAYER_PAIR;
        }
        this.resetInputControls();

        //
        var virtul_bet_area = GlobalData.virtual_node.bet_area;
        var node_item = { number: -1, bet_area: virtul_bet_area, bet_amount: 0, result_area: result_area, };
        node_item.number = GlobalData.big_road.totalNodeCnt() + 1;
        GlobalData.big_road.push(node_item);

        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_TIE_NODE, node_item.number);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT, null);
    },
    //撤销
    onClickErase(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickErase()");

        var node_cnt = GlobalData.big_road.totalNodeCnt();
        if (node_cnt <= 0) {
            return;
        }
        GlobalData.big_road.pop();

        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_ERASE_NODE, node_cnt);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT, null);
    },
    //清空
    onClickReset(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickReset()");

        var node_cnt = GlobalData.big_road.totalNodeCnt();
        if (node_cnt <= 0) {
            return;
        }
        GlobalData.big_road.reset();

        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_RESET, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_UPDATE_CNT, null);
    },
    //动态修改size
    onClickMoreBigger(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickMoreBigger()");

        GlobalData.gride_size.width += 10;
        GlobalData.gride_size.height += 10;
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
    },
    onClickMoreSmaller(event, event_data) {
        console.log(CONSTANTS.TAG, "onClickMoreSmaller()");

        if (GlobalData.gride_size.width <= 10) {
            console.warn(CONSTANTS.TAG, "onClickMoreSmaller(),GlobalData.gride_size.width:", GlobalData.gride_size.width);
            return;
        }
        GlobalData.gride_size.width -= 10;
        GlobalData.gride_size.height -= 10;
        EventManager.dispatchEvent(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
    },
    //获取输入
    getValueFromInputControls() {
        //庄对闲对
        var toggle_banker = this.toggle_banker_pair.getComponent(cc.Toggle);
        var is_banker_pair = toggle_banker.isChecked;

        var toggle_playerer = this.toggle_player_pair.getComponent(cc.Toggle);
        var is_player_pair = toggle_playerer.isChecked;

        //基础分
        var editbox_base = this.editbox_base.getComponent(cc.EditBox);
        //倍数
        var cmp = this.drop_down_box.getComponent('PrefabDropdownBox');
        var selected_index = cmp.getSelectedIndex();

        var base_score = Number(editbox_base.string);
        var bet_amount = base_score * this.drop_down_box_times[selected_index];

        return { is_banker_pair: is_banker_pair, is_player_pair: is_player_pair, bet_amount: bet_amount };
    },
    //重置输入控件
    resetInputControls() {
        var toggle_banker = this.toggle_banker_pair.getComponent(cc.Toggle);
        toggle_banker.isChecked = false;

        var toggle_player = this.toggle_player_pair.getComponent(cc.Toggle);
        toggle_player.isChecked = false;
    },

    //事件处理-下拉列表控件 选择
    onEventDropDownBoxSelected(event_name, udata) {
        //基础分
        var editbox_base = this.editbox_base.getComponent(cc.EditBox);
        //倍数
        var cmp = this.drop_down_box.getComponent('PrefabDropdownBox');
        var selected_index = cmp.getSelectedIndex();

        var base_score = Number(editbox_base.string);
        var bet_amount = base_score * this.drop_down_box_times[selected_index];
        
        this.label_bet_amount.getComponent(cc.Label).string = "实际下注额:" + bet_amount;

        //更新虚拟节点
        GlobalData.unit_bet_money = base_score;//基础分
        EventManager.dispatchEvent(EVENT.EVENT_NAME_QUERY_VIRTUAL_NODE, null);
    },
});
