/*
功能：预制件-大路横纵坐标刻度
说明：
*/


cc.Class({
    extends: cc.Component,

    properties: {
        label_index: {
            type: cc.Label,
            default: null,
            tooltip: "索引",
        },
    },

    onLoad() {
    },

    //设置索引
    setIndex(index) {
        this.label_index.getComponent(cc.Label).string = "-" + index + "-";
    },
});