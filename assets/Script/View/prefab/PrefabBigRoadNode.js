/*
功能：预制件-大路节点
说明：
*/

var EnumDefine = require("EnumDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        circle: {
            type: cc.Graphics,
            default: null,
            tooltip: "圆",
        },
        bet_amount: {
            type: cc.Label,
            default: null,
            tooltip: "下注额",
        },
        index: {
            type: cc.Label,
            default: null,
            tooltip: "索引",
        },        
        bet_area: {
            type: cc.Integer,
            default: 0,
            tooltip: "下注区域",
        },
        result_area: {
            type: cc.Integer,
            default: 0,
            tooltip: "结果区域",
        },
        check: {
            type: cc.Label,
            default: null,
            tooltip: "校验",
        },         
    },

    onLoad() {
        var ctx = this.circle.getComponent(cc.Graphics);
        //庄
        if (this.bet_area==EnumDefine.AREA_TYPE.BANKER) {            
            ctx.lineWidth = 6;
            ctx.strokeColor = new cc.Color().fromHEX('#FF0000');
            ctx.circle(0, 0, 29);
            ctx.stroke();
        }

        //闲
        if (this.bet_area==EnumDefine.AREA_TYPE.PLAYER) {
            ctx.lineWidth = 6;
            ctx.strokeColor = new cc.Color().fromHEX('#0000FF');
            ctx.circle(0, 0, 29);
            ctx.stroke();            
        }

        //对勾/叉叉
        if (this.bet_area==this.result_area) {
            this.check.node.color = new cc.Color().fromHEX('#00FF00');
            this.check.getComponent(cc.Label).string = "✓";
        } else {
            this.check.node.color = new cc.Color().fromHEX('#FF0000');
            this.check.getComponent(cc.Label).string = "x";
        }
    },

    //设置
    setInfo(index, bet_area, result_area) {
        this.index.getComponent(cc.Label).string = "" + index;
        this.bet_area = bet_area;
        this.result_area = result_area;
    },
});