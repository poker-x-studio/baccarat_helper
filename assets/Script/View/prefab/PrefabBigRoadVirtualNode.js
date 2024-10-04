/*
功能：预制件-大路虚拟节点
说明：
*/

var EnumDefine = require("EnumDefine");
var CONSTANTS = require("Constants");

var STAY_DURATION = 0.5; //停留时间

cc.Class({
    extends: cc.Component,

    properties: {
        circle: {
            type: cc.Graphics,
            default: null,
            tooltip: "圆",
        },
        label_bet_amount: {
            type: cc.Label,
            default: null,
            tooltip: "下注额",
        },
        bet_area: EnumDefine.AREA_TYPE.NULL,
    },

    onLoad() {
    },

    update(dt) {
    },

    //设置虚拟开牌结果
    setResult(bet_area, bet_amount) {
        this.label_bet_amount.getComponent(cc.Label).string = "下注:" + bet_amount;
        this.bet_area = bet_area;
        this.drawCircle();

        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .to(STAY_DURATION, {scale: 2},{easing: 'smooth'})
            .to(STAY_DURATION, {scale: 0.5},{easing: 'smooth'})
            .to(STAY_DURATION, {scale: 2},{easing: 'smooth'})
            .to(STAY_DURATION, {scale: 0.5},{easing: 'smooth'})
        )
        .start();
    },

    //画圆
    drawCircle() {
        //circle 宽高半径
        var width_circle = this.circle.node.width;
        var height_circle = this.circle.node.height;
        var r = Math.min(width_circle, height_circle) / 2;

        var ctx = this.circle.getComponent(cc.Graphics);
        
        var circle_clr;
        if (this.bet_area & EnumDefine.AREA_TYPE.BANKER) {
            circle_clr = CONSTANTS.CLR_BANKER;
        }
        if (this.bet_area & EnumDefine.AREA_TYPE.PLAYER) {
            circle_clr = CONSTANTS.CLR_PLAYER;
        }

        ctx.lineWidth = CONSTANTS.CIRCLE_LINE_WIDTH;
        ctx.strokeColor = circle_clr;
        ctx.circle(0, 0, r);
        ctx.stroke();
    },
});