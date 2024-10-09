/*
功能：下拉控件-选项数据
说明：
*/
var DropDownOptionData = cc.Class({
    extends: cc.Component,

    properties: {
        optionString: {
            type: "",
            default:"",
            tooltip: "选项-字符",
        },
        optionSf: {
            type: cc.SpriteFrame,
            default:null,
            tooltip: "选项-帧名",
        },
    },

    onLoad() {
    },

});

module.exports = DropDownOptionData;