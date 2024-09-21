/*
功能：预制件-统计区块的庄闲和
说明：
*/

var EnumDefine = require("EnumDefine");
var CONSTANTS = require("Constants");

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            type: cc.Label,
            default: null,
            tooltip: "",
        },
        bet_area: EnumDefine.AREA_TYPE.NULL,
    },

    onLoad() {
    },

    //设置结果
    setResult(bet_area) {
        this.bet_area = bet_area;
        if (bet_area & EnumDefine.AREA_TYPE.BANKER) {
            this.label.getComponent(cc.Label).string = "庄";
        } else if (bet_area & EnumDefine.AREA_TYPE.PLAYER) {
            this.label.getComponent(cc.Label).string = "闲";
        } else if (bet_area & EnumDefine.AREA_TYPE.TIE) {
            this.label.getComponent(cc.Label).string = "和";
        }
        this.draw_circle();
    },
    draw_circle() {
        //circle 宽高半径
        var width_circle = this.node.width;
        var height_circle = this.node.height;
        var r = Math.min(width_circle, height_circle) / 2;

        var ctx = this.node.getComponent(cc.Graphics);
        var circle_clr;
        if (this.bet_area & EnumDefine.AREA_TYPE.TIE) {//和
            circle_clr = CONSTANTS.CLR_TIE;
            ctx.fillColor = circle_clr;
            ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        } else {//庄闲
            if (this.bet_area & EnumDefine.AREA_TYPE.BANKER) {
                circle_clr = CONSTANTS.CLR_BANKER;
            }
            if (this.bet_area & EnumDefine.AREA_TYPE.PLAYER) {
                circle_clr = CONSTANTS.CLR_PLAYER;
            }
            ctx.fillColor = circle_clr;
            ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        }
    },
});