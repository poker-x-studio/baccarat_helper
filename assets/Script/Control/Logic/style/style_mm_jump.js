/*
功能：MM跳形态检测
说明：
*/
var EnumDefine = require("EnumDefine");
var StrategyUtils = require("Strategy_utils");

var StyleMMJump = {};

const HALF_STYLE = 1 //半形态
const FULL_STYLE = 2 //全形态

// MM跳形态检测  
StyleMMJump.checkMMJumpStyle = function (nodes) {
    var handlers = [
        StyleMMJump._checkSingleJumpStyle,
        StyleMMJump._checkDoubleJumpStyle,
        StyleMMJump._check3JumpStyle,
        StyleMMJump._check4JumpStyle,
    ];

    for (var i = 0; i < handlers.length; i++) {
        var check = handlers[i](nodes);
        if (check.is_ok) {
            return { is_ok: true, suggestion: check.suggestion };
        }
    }
    return { is_ok: false, suggestion: null };
}

// 单跳形态检测
StyleMMJump._checkSingleJumpStyle = function (nodes) {
    const MIN_NODE_CNT = 2 //最小节点数
    const MIN_COL_CNT = 2  // 最小列数

    var check_items = [
        {
            /*形态举例
            🔴🔵
            */
            style_type: FULL_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [1, 1],
            min_last_col_node_cnt: 1,
            max_last_col_node_cnt: 1,
        },
    ];

    var check_result = StyleMMJump._checkJumpStyle(nodes, MIN_NODE_CNT, MIN_COL_CNT, check_items);
    if (check_result.is_ok) {
        check_result.suggestion.comment = "检测到_单跳_形态";
        return check_result;
    }
    return { is_ok: false, suggestion: null };
}

// 双跳形态检测
StyleMMJump._checkDoubleJumpStyle = function (nodes) {
    const MIN_NODE_CNT = 4 //最小节点数
    const MIN_COL_CNT = 2  // 最小列数

    var check_items = [
        {
            /*形态举例
            🔴🔵🔴
            🔴🔵
            */
            style_type: HALF_STYLE,
            check_col_cnt: 3,
            col_node_cnts: [2, 2, -1],
            min_last_col_node_cnt: 1,
            max_last_col_node_cnt: 1,
        },
        {
            /*形态举例
            🔴🔵
            🔴🔵
            */
            style_type: FULL_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [2, 2],
            min_last_col_node_cnt: 2,
            max_last_col_node_cnt: 2,
        },
    ];

    var check_result = StyleMMJump._checkJumpStyle(nodes, MIN_NODE_CNT, MIN_COL_CNT, check_items);
    if (check_result.is_ok) {
        check_result.suggestion.comment = "检测到_双跳_形态";
        return check_result;
    }
    return { is_ok: false, suggestion: null };
}

// 三跳形态检测
StyleMMJump._check3JumpStyle = function (nodes) {
    const MIN_NODE_CNT = 5 //最小节点数
    const MIN_COL_CNT = 2  // 最小列数

    var check_items = [
        {
            /*形态举例
            🔴🔵
            🔴🔵
            🔴
            */
            style_type: HALF_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [3, 2],
            min_last_col_node_cnt: 2,
            max_last_col_node_cnt: 2,
        },
        {
            /*形态举例
            🔴🔵🔴
            🔴🔵
            🔴🔵
            */
            /*形态举例
            🔴🔵🔴
            🔴🔵🔴
            🔴🔵
            */
            style_type: HALF_STYLE,
            check_col_cnt: 3,
            col_node_cnts: [3, 3, -1],
            min_last_col_node_cnt: 1,
            max_last_col_node_cnt: 2,
        },
        {
            /*形态举例
            🔴🔵
            🔴🔵
            🔴🔵
            */
            style_type: FULL_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [3, 3],
            min_last_col_node_cnt: 3,
            max_last_col_node_cnt: 3,
        },
    ];

    var check_result = StyleMMJump._checkJumpStyle(nodes, MIN_NODE_CNT, MIN_COL_CNT, check_items);
    if (check_result.is_ok) {
        check_result.suggestion.comment = "检测到_三跳_形态";
        return check_result;
    }
    return { is_ok: false, suggestion: null };
}

// 四跳形态检测
StyleMMJump._check4JumpStyle = function (nodes) {
    const MIN_NODE_CNT = 7 //最小节点数
    const MIN_COL_CNT = 2  // 最小列数

    var check_items = [
        {
            /*形态举例
            🔴🔵
            🔴🔵
            🔴🔵
            🔴
            */
            style_type: HALF_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [4, 3],
            min_last_col_node_cnt: 3,
            max_last_col_node_cnt: 3,
        },
        {
            /*形态举例
            🔴🔵🔴
            🔴🔵
            🔴🔵
            🔴🔵
            */
            /*形态举例
            🔴🔵🔴
            🔴🔵🔴
            🔴🔵
            🔴🔵
            */
            /*形态举例
            🔴🔵🔴
            🔴🔵🔴
            🔴🔵🔴
            🔴🔵
            */
            style_type: HALF_STYLE,
            check_col_cnt: 3,
            col_node_cnts: [4, 4, -1],
            min_last_col_node_cnt: 1,
            max_last_col_node_cnt: 3,
        },
        {
            /*形态举例
            🔴🔵
            🔴🔵
            🔴🔵
            🔴🔵
            */
            style_type: FULL_STYLE,
            check_col_cnt: 2,
            col_node_cnts: [4, 4],
            min_last_col_node_cnt: 4,
            max_last_col_node_cnt: 4,
        },
    ];

    var check_result = StyleMMJump._checkJumpStyle(nodes, MIN_NODE_CNT, MIN_COL_CNT, check_items);
    if (check_result.is_ok) {
        check_result.suggestion.comment = "检测到_四跳_形态";
        return check_result;
    }
    return { is_ok: false, suggestion: null };
}

StyleMMJump._checkJumpStyle = function (nodes, min_node_cnt, min_col_cnt, check_items) {

    //最少节点数校验
    var node_cnt = nodes.length;
    if (node_cnt < min_node_cnt) {
        return { is_ok: false, suggestion: null };
    }

    //最少列数校验
    var big_road_all = StrategyUtils.NewBigRoadWithNodes(nodes)
    var cols_cnt = big_road_all.colCnt();
    if (cols_cnt < min_col_cnt) {
        return { is_ok: false, suggestion: null };
    }

    var is_ok = false;
    var bet_area = EnumDefine.AREA_TYPE.NULL;

    for (var i = 0; i < check_items.length; i++) {
        var check_item = check_items[i];

        //提取列节点分布情况
        var extract_result = StrategyUtils.extractColNodes(big_road_all, check_item.check_col_cnt);
        if (!extract_result.is_ok) {
            continue
        }
        var col_nodes = extract_result.col_nodes;
        var col_nodes_len = col_nodes.length;
        var last_col_node_cnt = col_nodes[col_nodes_len - 1]

        //最后一列节点个数校验
        if ((last_col_node_cnt < check_item.min_last_col_node_cnt) || (last_col_node_cnt > check_item.max_last_col_node_cnt)) {
            continue
        }

        if (check_item.style_type == HALF_STYLE) { //半形态
            is_ok = true
            //校验列的节点数必须保持一致
            for (var j = col_nodes_len - 2; j >= 0; j--) {
                if (check_item.col_node_cnts[j] != col_nodes[j]) {
                    is_ok = false
                    break
                }
            }
            if (!is_ok) {
                continue
            }

            return {
                is_ok: true, suggestion: {
                    style: EnumDefine.STYLE_TYPE.MM_JUMP,
                    bet_area: big_road_all.lastCol().resultArea(),
                    comment: "",
                    alart: true,
                }
            };
        }

        if (check_item.style_type == FULL_STYLE) { //全形态
            is_ok = true
            //校验列的节点数必须保持一致
            for (var j = col_nodes_len - 1; j >= 0; j--) {
                if (check_item.col_node_cnts[j] != col_nodes[j]) {
                    is_ok = false
                    break
                }
            }
            if (!is_ok) {
                continue
            }

            if (big_road_all.lastCol().resultArea() == EnumDefine.AREA_TYPE.BANKER) {
                bet_area = EnumDefine.AREA_TYPE.PLAYER;
            } else {
                bet_area = EnumDefine.AREA_TYPE.BANKER;
            }

            return {
                is_ok: true, suggestion: {
                    style: EnumDefine.STYLE_TYPE.MM_JUMP,
                    bet_area: bet_area,
                    comment: "",
                    alart: true,
                }
            };
        }
    }

    return { is_ok: false, suggestion: null };
}

module.exports = StyleMMJump;

