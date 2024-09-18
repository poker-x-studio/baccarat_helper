
var ViewManager = require("ViewManager");
var ResManager = require("ResManager");

cc.Class({
    extends: cc.Component,

    properties: {
        viewManager: {
            type: ViewManager,
            default: null,
            tooltip: "视图管理",
        },
        resManager: {
            type: ResManager,
            default: null,
            tooltip: "资源管理",
        },
    },

    // use this for initialization
    onLoad: function () {
        window.app = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node);

        //显示状态，帧率等
        cc.debug.setDisplayStats(false);

        //预加载资源
        this.preload_res();
    },

    // called every frame
    update: function (dt) {
    },

    //预加载资源
    preload_res() {
        //预加载
        window.app.resManager.load_prefab_bigroad_node();

        //debug测试
        //this.debug_test();
    },
});
