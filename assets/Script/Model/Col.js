/*
功能：大路-列
说明：列是节点的容器
*/
var EnumDefine = require("EnumDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        nodes: {
            type: [cc.Object],
            default: [],
            tooltip: "一列",
        },
    },

    //初始化
    init() {
    },

    //插入
    push(node_item) {
        this.nodes.push(node_item);
    },
    //删除最后的节点
    pop() {
        this.nodes.pop();
    },

    //当前列的结果区
    resultArea() {
        if (this.nodes.length <= 0) {
            return EnumDefine.AREA_TYPE.NULL;
        }
        return this.nodes[0].result_area;
    },

    //列中的节点个数
    nodeCnt() {
        return this.nodes.length;
    },

    //获取节点
    getNode(index) {
        if ((index < 0) || (index >= this.nodes.length)) {
            return nil
        }
        return this.nodes[index];
    },

});

