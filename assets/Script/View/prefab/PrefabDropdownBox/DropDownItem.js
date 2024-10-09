/*
功能：下拉控件-
说明：
*/
var DropDownItem = cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            type: cc.Label,
            default:null,
            tooltip: "",
        },
        sprite: {
            type: cc.SpriteFrame,
            default:null,
            tooltip: "",
        },
        toggle: {
            type: cc.Toggle,
            default:null,
            tooltip: "",
        },
    },

    onLoad() {
    },

});

module.exports = DropDownItem;