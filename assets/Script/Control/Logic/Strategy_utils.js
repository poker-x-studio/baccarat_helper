/*
功能：
说明：
*/
var EnumDefine = require("EnumDefine");
var BigRoad = require("BigRoad");

var StrategyUtils = {};

//是否是获胜节点 
StrategyUtils.is_win_node = function (node_item) {
    //console.log(CONSTANTS.TAG, "StrategyUtils.is_win_node(),node_item:", node_item);
    if ((node_item.bet_area & node_item.result_area) > 0) {
        return true;
    }
    return false;
}

//是否和节点
StrategyUtils.is_tie_node = function (node_item) {
    //console.log(CONSTANTS.TAG, "StrategyUtils.is_tie_node(),node_item:", node_item);
    if ((node_item.result_area & EnumDefine.AREA_TYPE.TIE) > 0) {
        return true;
    }
    return false;
}

//去除和节点
StrategyUtils.exclude_tie_nodes = function (node_list) {
    //去除和节点
    var nodes = [];
    for (var i = 0; i < node_list.length; i++) {
        var node = node_list[i];
        if (this.is_tie_node(node)) {
            continue;
        }
        nodes[nodes.length] = node;
    }
    return nodes;
}

//是否同一种结果区
StrategyUtils.is_same_area_type = function (node_list) {
    if(node_list.length <= 1){
        return false;
    }

    var target_node = node_list[0];
    for (var i = 1; i < node_list.length; i++) {
        var node = node_list[i];
        if (target_node.result_area != node.result_area) {
            return false;
        }
    }
    return true;
}

//新建大路
StrategyUtils.NewBigRoadWithNodes = function (nodes) {
	var big_road = new BigRoad();
	for (var i = 0; i < nodes.length; i++) {
		big_road.push(nodes[i]);
	}
	return big_road;
};

// 提取需要的列,列节点数分布情况
StrategyUtils.extract_col_nodes = function (big_road, check_col_cnt) {
	var col_nodes = [];
	var col_cnt = big_road.col_cnt();
	if (check_col_cnt > col_cnt) {
		return { is_ok: false, col_nodes: null };
	}

	for (var i = col_cnt - check_col_cnt; i < col_cnt; i++) {
		col_nodes[col_nodes.length] = big_road.get_col(i).node_cnt();
	}

	return { is_ok: true, col_nodes: col_nodes };
}


module.exports = StrategyUtils;

