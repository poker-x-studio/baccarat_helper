/*
功能：主视图
说明：
*/
var EnumDefine = require("EnumDefine");
var BigRoad = require("BigRoad");
var EVENT = require("Event");
var EventManager = require("EventManager");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        //window.app.viewManager.alert("提示框");
    },

    // called every frame
    update: function (dt) {

    },
    //庄家
    onClickBanker(event, event_data) {
        var node_item = { index: -1, bet_area: EnumDefine.AREA_TYPE.BANKER, bet_amount: 100, result_area: EnumDefine.AREA_TYPE.BANKER, };
        node_item.index = BigRoad.total_node_cnt();
        BigRoad.push(node_item);

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_BANKER, node_item.index);
    },
    //闲家
    onClickPlayer(event, event_data) {
        var node_item = { index: -1, bet_area: EnumDefine.AREA_TYPE.BANKER, bet_amount: 200, result_area: EnumDefine.AREA_TYPE.PLAYER, };
        node_item.index = BigRoad.total_node_cnt();
        BigRoad.push(node_item);

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_PLAYER, node_item.index);
    },
    //撤销
    onClickErase(event, event_data) {  
        var node_cnt = BigRoad.total_node_cnt();   
        if(node_cnt <= 0){
            return ;
        }
        BigRoad.pop();

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_ERASE, node_cnt-1);
    },
});
