/*
功能：主视图
说明：
*/
var EnumDefine = require("EnumDefine");
var BigRoad = require("BigRoad");
var EVENT = require("Event");
var EventManager = require("EventManager");
var GlobalData = require("GlobalData");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.scheduleOnce(function() {
            EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
        }.bind(this), 0.1);

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

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_BANKER_NODE, node_item.index);
    },
    //闲家
    onClickPlayer(event, event_data) {
        var node_item = { index: -1, bet_area: EnumDefine.AREA_TYPE.BANKER, bet_amount: 200, result_area: EnumDefine.AREA_TYPE.PLAYER, };
        node_item.index = BigRoad.total_node_cnt();
        BigRoad.push(node_item);

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_PLAYER_NODE, node_item.index);
    },
    //撤销
    onClickErase(event, event_data) {  
        var node_cnt = BigRoad.total_node_cnt();   
        if(node_cnt <= 0){
            return ;
        }
        BigRoad.pop();

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_ERASE_NODE, node_cnt-1);
    },
    //清空
    onClickReset(event, event_data) {  
        var node_cnt = BigRoad.total_node_cnt();   
        if(node_cnt <= 0){
            return ;
        }
        BigRoad.reset();

        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_RESET, null);
    },    
    //动态修改size
    onClickMoreBigger(event, event_data) { 
        GlobalData.gride_size.width += 10;
        GlobalData.gride_size.height += 10;
        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
    }, 
    onClickMoreSmaller(event, event_data) {
        if( GlobalData.gride_size.width<=10){
            return ;
        } 
        GlobalData.gride_size.width -= 10;
        GlobalData.gride_size.height -= 10;
        EventManager.dispatch_event(EVENT.EVENT_NAME_BIG_ROAD_GRIDE_SIZE, GlobalData.gride_size);
    },        
});
