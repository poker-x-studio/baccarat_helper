/*
功能：龙形态检测
说明：
*/  
var EnumDefine = require("EnumDefine");
var StrategyUtils = require("Strategy_utils");

var StyleLong = {};

var LONG_MIN_NODE_CNT = 3 //最少节点数
var LONG_MIN_COL_CNT  = 1 //最少列数

// 龙形态检测  
StyleLong.checkLongStyle = function (nodes) {  
    const node_cnt = nodes.length;  
    if (node_cnt < LONG_MIN_NODE_CNT) {  
        return {is_ok:false,  suggestion:null};  
    }  

    var start_index = node_cnt - LONG_MIN_NODE_CNT
	var part_nodes = nodes.slice(start_index, start_index+LONG_MIN_NODE_CNT);	
	if (!StrategyUtils.is_same_area_type(part_nodes)) {
		return {is_ok:false,  suggestion:null};  
	}

    return {is_ok:true, suggestion:{  
        style: EnumDefine.STYLE_TYPE.LONG,  
        bet_area: part_nodes[0].result_area,  
        comment: "检测到_长龙_形态",  
        alert: false  
    }};  
}  


module.exports = StyleLong;

