/*
功能：预制件-大路节点
说明：
*/

var EnumDefine = require("EnumDefine");

var CLR_BANKER = new cc.Color().fromHEX('#FF0000');
var CLR_PLAYER = new cc.Color().fromHEX('#0000FF');
var CLR_TIE = new cc.Color().fromHEX('#98C047');
var LINE_WIDTH = 6;
var PAIR_R = 8; //对子实心圆半径

cc.Class({
    extends: cc.Component,

    properties: {
        circle: {
            type: cc.Graphics,
            default: null,
            tooltip: "圆",
        },
        label_index: {
            type: cc.Label,
            default: null,
            tooltip: "索引",
        },
        label_bet_amount: {
            type: cc.Label,
            default: null,
            tooltip: "下注额",
        },
        label_check: {
            type: cc.Label,
            default: null,
            tooltip: "校验",
        },
        bet_area: EnumDefine.AREA_TYPE.NULL,
        result_area: EnumDefine.AREA_TYPE.NULL,
    },

    onLoad() {
        //circle 宽高半径
        var width_circle = this.circle.node.width;
        var height_circle = this.circle.node.height;
        var r = Math.min(width_circle, height_circle) / 2;

        var ctx = this.circle.getComponent(cc.Graphics);
        var circle_clr;
        if (this.result_area & EnumDefine.AREA_TYPE.TIE) {//和
            circle_clr = CLR_TIE;
            ctx.lineWidth = LINE_WIDTH;
            ctx.strokeColor = circle_clr;
            ctx.circle(0, 0, r);

            //斜线
            ctx.moveTo(-r, -r);
            ctx.lineTo(r, r);
            ctx.stroke();  
        } else {//庄闲
            if (this.result_area & EnumDefine.AREA_TYPE.BANKER) {
                circle_clr = CLR_BANKER;
            }
            if (this.result_area & EnumDefine.AREA_TYPE.PLAYER) {
                circle_clr = CLR_PLAYER;
            }
            ctx.lineWidth = LINE_WIDTH;
            ctx.strokeColor = circle_clr;
            ctx.circle(0, 0, r);
            ctx.stroke();
        }

        //庄对闲对
        if (this.result_area & EnumDefine.AREA_TYPE.BANKER_PAIR) {
            ctx.lineWidth = 0;
            ctx.fillColor = CLR_BANKER;
            ctx.arc(-r + 2, r / 2, PAIR_R, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        }
        if (this.result_area & EnumDefine.AREA_TYPE.PLAYER_PAIR) {
            ctx.lineWidth = 0;
            ctx.fillColor = CLR_PLAYER;
            ctx.arc(r - 2, -r / 2, PAIR_R, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        }
    },

    //设置开牌结果
    setResult(index, bet_area, bet_amount, result_area) {
        this.label_index.getComponent(cc.Label).string = "" + index;

        //对勾/叉叉
        if (result_area & EnumDefine.AREA_TYPE.TIE) {//和
            this.label_bet_amount.node.active = false;
            this.label_check.node.active = false;
        } else {//庄闲
            this.label_bet_amount.getComponent(cc.Label).string = "" + bet_amount;
            if ((bet_area & EnumDefine.AREA_TYPE.BANKER) && (result_area & EnumDefine.AREA_TYPE.BANKER)) {
                this.label_check.node.color = new cc.Color().fromHEX('#00FF00');
                this.label_check.getComponent(cc.Label).string = "✓";
            } else {
                this.label_check.node.color = new cc.Color().fromHEX('#FF0000');
                this.label_check.getComponent(cc.Label).string = "x";
            }
        }

        this.bet_area = bet_area;
        this.result_area = result_area;
    },
});