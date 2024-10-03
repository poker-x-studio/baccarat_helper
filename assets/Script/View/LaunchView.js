/*
功能：启动视图
说明：启动视图主要是预加载资源的过渡
*/
var EnumDefine = require("EnumDefine");
const CONSTANTS = require("Constants");

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar_load: {//进度条     
            type: cc.ProgressBar,
            default: null
        },
        label: {
            type: cc.Label,
            default: null,
            tooltip: "",
        },
    },

    onLoad: function () {
        console.log(CONSTANTS.TAG, "LaunchView.onLoad(),");
    },
    start() {    
    },
    update: function (dt) {
        this._updateProgressBar(this.progressBar_load, dt);
    },
    //进度条
    _updateProgressBar: function (progressBar, dt) { 
        var progress = window.app.resManager.get_load_progress();
        console.log(CONSTANTS.TAG, "资源加载进度,", progress * 100);
        if (progress == 1) {
            this.label.getComponent(cc.Label).string = "资源加载,完成" + parseInt(progress * 100) + "%";
            window.app.showView(EnumDefine.VIEW_TYPE.MAIN); 
        } else {
            this.label.getComponent(cc.Label).string = "努资源加载中" + parseInt(progress * 100) + "%";
        }
        progressBar.progress = progress;
    }
});
