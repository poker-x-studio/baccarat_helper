/*
功能：预制件-弹窗提示
说明：
*/

//弹窗停留时间
var STAY_DURATION = 10;

cc.Class({
    extends: cc.Component,

    properties: {
        label_text: {
            type:cc.Label, 
            default:null,
            tooltip:"提示信息",
        }
    },

    onLoad() {
        this.node.scale = 0;
    },

    //设置文字
    setText(text) {
        this.label_text.string = text;
    },

    start() {
        cc.tween(this.node)
            .to(0.1, {
                scale: 1
            })
            .delay(STAY_DURATION/2)
            .to(STAY_DURATION/2, {
                opacity: 0
            })
            .call(() => {
                this.node.removeFromParent();
            })
            .start()
    }
});