
var ViewManager = require("ViewManager");

cc.Class({
    extends: cc.Component,

    properties: {
        viewManager: {
            type: ViewManager,
            default: null,
            tooltip:"视图管理",
        }, 
    },

    // use this for initialization
    onLoad: function () {
        window.app = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node);

        //显示状态，帧率等
        cc.debug.setDisplayStats(false);
    },
 
    // called every frame
    update: function (dt) {

    },
});
