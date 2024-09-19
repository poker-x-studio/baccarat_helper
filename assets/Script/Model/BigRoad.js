/*
功能：大路
说明：大路是列的容器
*/
var Col = require("Col");

//节点
var node_item = { index: 0, bet_amount: 0, bet_area: 0, result_area: 0, };

var BigRoad = {

    properties: {
        //大路-列
        cols: {
            type: [Col],
            default: [],
            tooltip: "所有大路的列",
            visible: false,
        },
    },

    //初始化
    init() {
        this.cols = [];
    },

    //队尾插入
    push(node_item) {
        if (this.cols == null) {
            this.init();
        }
        this._push_element(node_item);
    },
    _push_element(node_item) {
        if (this.col_cnt() == 0) {
            var col = new Col();
            col.push(node_item)
            this.cols.push(col);
            return
        }

        //最后一列
        var last_col = this.last_col()
        if (last_col.result_area() == node_item.result_area) {
            last_col.push(node_item)
        } else { //新创建一列
            var col = new Col();
            col.push(node_item)
            this.cols.push(col);
        }
    },
    //删除最后的列
    pop() {
        if (this.col_cnt() == 0) {
            return;
        }
        var last_col = this.last_col();
        if(last_col.node_cnt() == 1) {
            this.cols.pop();
        } else{
            last_col.pop();
        }
    },
    //清空
    reset() {
        this.init();
    },
    //列数
    col_cnt() {
        if (this.cols == null) {
            return 0;
        }
        return this.cols.length;
    },
    //获取列
    get_col(col_index) {
        if ((col_index < 0) || (col_index >= this.col_cnt())) {
            return null;
        }
        return this.cols[col_index];
    },
    //最后的一列
    last_col() {
        if (this.col_cnt() == 0) {
            return;
        }
        return this.cols[this.cols.length - 1];
    },

    //总节点数
    total_node_cnt() {
        var total_cnt = 0
        for (var col_index = 0; col_index < this.col_cnt(); col_index++) {
            total_cnt += this.get_col(col_index).node_cnt()
        }
        return total_cnt
    },
};

module.exports = BigRoad;