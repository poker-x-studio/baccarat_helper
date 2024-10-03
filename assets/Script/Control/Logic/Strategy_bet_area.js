/*
功能：下注区策略
说明：
*/  
var EnumDefine = require("EnumDefine");
var StyleMMJump = require("style_mm_jump");
var StyleLong = require("style_long");
var StyleFollow = require("style_follow");
var StrategyUtils = require("Strategy_utils");

var Strategy_bet_area = {

    properties: {
    },

    //初始化
    init() {
    },
    //查询下注区
    query_bet_area(big_road_nodes){
        var handlers = [
            StyleMMJump.checkMMJumpStyle,
            StyleLong.checkLongStyle,
            StyleFollow.checkFollowStyle,
        ];
    
        //去除和节点
        var node_list = StrategyUtils.exclude_tie_nodes(big_road_nodes);

        //检测
        for(var i=0; i<handlers.length; i++ ){
            check = handlers[i](node_list);
            if (check.is_ok == true) {
                return check.suggestion;
            }
        }     

        //异常
        return {suggestion:{  
            style: EnumDefine.STYLE_TYPE.NULL,  
            bet_area: EnumDefine.AREA_TYPE.BANKER,  
            comment: "异常",  
            alert: false  
        }}; 
    },
};

module.exports = Strategy_bet_area;

