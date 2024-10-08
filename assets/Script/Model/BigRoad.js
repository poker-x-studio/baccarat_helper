/*
功能：大路
说明：大路是列的容器
*/
var EnumDefine = require("EnumDefine");
var CONSTANTS = require("Constants");
var Col = require("Col");

//节点
var node_item = { number: 0, bet_amount: 0, bet_area: 0, result_area: 0, };

cc.Class({
    extends: cc.Component,

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
        this._pushElement(node_item);
    },
    _pushElement(node_item) {
        if (this.colCnt() == 0) {
            var col = new Col();
            col.push(node_item)
            this.cols.push(col);
            return
        }

        //最后一列
        var last_col = this.lastCol()
        if ((last_col.resultArea()==node_item.result_area) || (node_item.result_area&EnumDefine.AREA_TYPE.TIE)) {//结果区相等或和
            last_col.push(node_item)
        } else { //新创建一列
            var col = new Col();
            col.push(node_item)
            this.cols.push(col);
        }
    },
    //删除最后的列
    pop() {
        if (this.colCnt() == 0) {
            return;
        }
        var last_col = this.lastCol();
        if(last_col.nodeCnt() == 1) {
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
    colCnt() {
        if (this.cols == null) {
            return 0;
        }
        return this.cols.length;
    },
    //获取列
    getCol(col_index) {
        if ((col_index < 0) || (col_index >= this.colCnt())) {
            return null;
        }
        return this.cols[col_index];
    },
    //最后的一列
    lastCol() {
        if (this.colCnt() == 0) {
            return;
        }
        return this.cols[this.cols.length - 1];
    },
    //所有的节点
    dumpNodes() {
        var list = [];
        for (var i = 0; i < this.colCnt(); i++) {
            var col = this.cols[i];

            for (var j = 0; j < col.nodeCnt(); j++) {
                list[list.length] = col.getNode(j);
            }
        }
        return list;
    },
    //统计个数
    statCnt(){
        var nodes = this.dumpNodes();
        var info = {banker_cnt:0,player_cnt:0,tie_cnt:0,banker_pair_cnt:0,player_pair_cnt:0,};
        for(var i=0; i<nodes.length; i++){
            var node = nodes[i];
            if(node.result_area & EnumDefine.AREA_TYPE.BANKER){
                info.banker_cnt++;
            }
            if(node.result_area & EnumDefine.AREA_TYPE.PLAYER){
                info.player_cnt++;
            }
            if(node.result_area & EnumDefine.AREA_TYPE.TIE){
                info.tie_cnt++;
            }
            if(node.result_area & EnumDefine.AREA_TYPE.BANKER_PAIR){
                info.banker_pair_cnt++;
            }
            if(node.result_area & EnumDefine.AREA_TYPE.PLAYER_PAIR){
                info.player_pair_cnt++;
            }
        }
        return info;
    },
    //总节点数
    totalNodeCnt() {
        var total_cnt = 0
        for (var col_index = 0; col_index < this.colCnt(); col_index++) {
            total_cnt += this.getCol(col_index).nodeCnt()
        }
        return total_cnt
    },
    //当前盈利
    profit() {
        var total_profit = 0;
        var nodes = this.dumpNodes();
        for(var i=0; i<nodes.length; i++){
            var node = nodes[i];
            if((node.bet_area & node.result_area) > 0){
                total_profit += node.bet_amount;
            } else {
                total_profit -= node.bet_amount;
            }
        }        
        return total_profit;
    },
    //输出
    print() {
        var nodes = this.dumpNodes();
        for(var i=0; i<nodes.length; i++){
            var node = nodes[i];
            console.log(CONSTANTS.TAG, "nodes[", i , "]=", "{bet_area:", node.bet_area,",bet_amount:", node.bet_amount,",result_area:", node.result_area,"}");
        }
    },
});