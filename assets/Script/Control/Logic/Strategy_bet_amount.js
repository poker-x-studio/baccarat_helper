/*
功能：下注额策略
说明：
马丁格尔N策略:连续输N把内,输了加倍,之后恢复原始注码,增加止损的概念
*/
var EnumDefine = require("EnumDefine");
var GlobalData = require("GlobalData");

var node_item = { bet_arae: EnumDefine.AREA_TYPE.NULL, bet_amount: 0, result_area: EnumDefine.AREA_TYPE.NULL, };

var Strategy_bet_amount = {
    properties: {
    },

    //查询下注额
    query_bet_amount(big_road_nodes) {
        //大路刚刚开始
        if ((big_road_nodes == null) || (big_road_nodes.length <= 1)) {
            return GlobalData.unit_amount;
        }

        //去除和节点
        var node_list = [];
        for (var i = 0; i < big_road_nodes.length; i++) {
            var node = big_road_nodes[i];
            if (this.is_tie_node(node)) {
                continue;
            }
            node_list[node_list.length] = node;
        }

        //最后一个节点
        var last_node = node_list[node_list.length - 1];
        if (this.is_win_node(last_node)) { //赢了
            return GlobalData.unit_amount;
        }

        //输了

        //连续输的节点数
        var lose_node_cnt = 0;
        for (var i = node_list.length - 1; i >= 0; i--) {
            if (!this.is_win_node(node_list[i])) {
                lose_node_cnt++
            }
            if (this.is_win_node(node_list[i])) {
                break
            }
        }

        if (lose_node_cnt <= GlobalData.martegal_continue_lose_cnt) { //输少于等于N颗，倍投                
            return 2 * last_node.bet_amount;
        } else { //连续输N颗，放弃倍投
            return GlobalData.unit_amount;
        }
    },

    //是否是获胜节点
    is_win_node(node_item) {
        if ((node_item.bet_arae & node_item.result_area) > 0) {
            return true;
        }
        return false;
    },
    //是否和节点
    is_tie_node(node_item) {
        if ((node_item.result_area & EnumDefine.AREA_TYPE.TIE) > 0) {
            return true;
        }
        return false;
    },
};

module.exports = Strategy_bet_amount;

