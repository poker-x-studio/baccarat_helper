/*
功能：大路面板
说明：
*/
cc.Class({
    extends: cc.Component,

    properties: {
        stat_block: {
            type: cc.Node,
            default: null,
            tooltip: "统计区块",
        },        
        gride_block: {
            type: cc.Node,
            default: null,
            tooltip: "网格区块",
        },
    },

    onLoad() {
    },
    onDestroy() {
    },

});
