
var ViewManager = require("ViewManager");
var ResManager = require("ResManager");
var GlobalData = require("GlobalData");
const CONSTANTS = require("../Model/Constants");
const EnumDefine = require("../Model/EnumDefine");

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
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        window.app = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node);

        //显示状态，帧率等
        cc.debug.setDisplayStats(false);

        //预加载资源
        this.preloadRes();

        //初始化
        GlobalData.init();

        //
        this.showView(EnumDefine.VIEW_TYPE.LAUNCH);
    },

    // called every frame
    update: function (dt) {
    },

    //预加载资源
    preloadRes() {
        console.log(CONSTANTS.TAG, 'preloadRes()');

        //预加载
        window.app.resManager.preloadPrefab();

        //debug测试
        //this.debugTest();
    },

    //显示视图
    showView(view_type) {
        //启动视图
        if (view_type == EnumDefine.VIEW_TYPE.LAUNCH) {
            this.setLayerActive("launch_view", true);
            this.setLayerActive("main_view", false);
            return;
        }

        //主视图
        if (view_type == EnumDefine.VIEW_TYPE.MAIN) {
            this.setLayerActive("launch_view", false);
            this.setLayerActive("main_view", true);
            return;
        }
    },
    setLayerActive(nodePath, active) {
        var node = cc.find("Canvas/" + nodePath);
        if(node){
            node.active = active;
        }
    }, 
    //debug测试
    debugTest() {
    },
});
