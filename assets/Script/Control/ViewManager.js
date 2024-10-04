/*
功能：公共视图管理
说明：
*/  
var CONSTANTS = require("Constants");

var ALERT_ZINDEX = 100;

cc.Class({
    extends: cc.Component,

    properties: {
        viewList: {
            default: [],
            visible: false,
        },
        viewBtns: {
            default: [],
            visible: false,
        },
        curView:{
            default: null,
            type:cc.Node,
            visible: false,
        },
    },

    onLoad() {
        this.viewList = [];
    },

    CloseCurView(){
        if(this.curView.active){
            this.showView(this.curView, 0.3, false);
        }
    },

    GetUIPosition(myNode,parentNode,UINode){
        var temp1 = parentNode.convertToWorldSpaceAR(myNode.getPosition());
        var temp2 = UINode.convertToNodeSpaceAR(temp1);
        myNode.parent = UINode;
        myNode.position = temp2;
    },

    showView(view, during, inOut, isCloseAll = true , delayTrue = 0, cb) {
        var isSave = true;
        var idx;
        for (var i = 0; i < this.viewList.length; i = i + 1) {
            if (view == this.viewList[i]) {
                isSave = false;
                idx = i;
            } else {
                if (this.viewList[i].active && inOut && isCloseAll) {
                    this.viewList[i].stopAllActions();
                    this.showAnim(this.viewList[i], 0.1, i, false);
                }
            }
        }
        if (isSave) {
            idx = this.viewList.length;
            this.viewList[idx] = view;
            this.viewBtns[idx] = [];
            var childs = [];
            childs = view.getChildren();
            for (var i = 0; i < childs.length; i = i + 1) {
                var temp = childs[i].getComponent(cc.Button);
                if (null != temp) {
                    this.viewBtns[idx][this.viewBtns[idx].length] = temp;
                }else{
                    var sChilds = [];
                    sChilds = childs[i].getChildren();
                    for (var j = 0; j < sChilds.length; j = j + 1) {
                        var sTemp = sChilds[j].getComponent(cc.Button);
                        if (null != sTemp) {
                            this.viewBtns[idx][this.viewBtns[idx].length] = sTemp;
                        }else{
                            var tChilds = [];
                            tChilds = sChilds[j].getChildren();
                            for (var k = 0; k < tChilds.length; k = k + 1) {
                                var tTemp = tChilds[k].getComponent(cc.Button);
                                if (null != tTemp) {
                                    this.viewBtns[idx][this.viewBtns[idx].length] = tTemp;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.showAnim(this.viewList[idx], during, idx, inOut, delayTrue , cb);
    },

    showAnim(view, during, idx, inOut , delayTrue, cb) {
        //渐现
        if (inOut && view.active == false) {
            view.active = true;
            this.curView = view;
            view.runAction(cc.sequence(cc.fadeIn(during), cc.callFunc(function () {
                if(delayTrue > 0){
                    this.scheduleOnce(function(){
                        if(view.active){
                            for (var i = 0; i < this.viewBtns[idx].length; i = i + 1) {
                                if(this.viewBtns[idx][i] != null ){
                                    this.viewBtns[idx][i].interactable = true;
                                }
                            }
                        }
                    }.bind(this),delayTrue)
                }else{
                    for (var i = 0; i < this.viewBtns[idx].length; i = i + 1) {
                        if(this.viewBtns[idx][i] != null ){
                            this.viewBtns[idx][i].interactable = true;
                        }
                    }
                }
                if (null != cb) {
                    cb();
                }
            }.bind(this), this)));

            //渐隐
        } else if (!inOut && view.active == true) {
            for (var i = 0; i < this.viewBtns[idx].length; i = i + 1) {
                this.viewBtns[idx][i].interactable = false;
            }
            var seq = cc.sequence(cc.fadeOut(during),
                cc.callFunc(function () {
                    view.active = false;
                    if (null != cb) {
                        cb();
                    }
                }.bind(this)));
            view.runAction(seq);
        }
    },

    removeView(view){
        for (var i = 0; i < this.viewList.length; i = i + 1) {
            if (view == this.viewList[i]) {
                this.viewList.splice(i, 1);
            }
        }
    },

    //弹窗
    alert(text) {
        var alert_prefab = window.app.resManager.getPrefab(CONSTANTS.PREFAB_ALERT);
        if (alert_prefab != null) {
            var alert = cc.instantiate(alert_prefab);
            alert.getComponent('PrefabAlert').setText(text);
            cc.find('Canvas').addChild(alert, ALERT_ZINDEX);
        }
    }, 

    //面板显示动作
    //inOut:是否是显示
    showPanelAction(view, during, inOut, cb) {
        var start_pos = cc.v2(0, 3000);
        var end_pos = cc.v2(0, 0);
        
        if (inOut && view.active == false) {//显示
            view.active = true;

            //移动到起始位置
            //最后到终点位置[反弹效果]
            var action_mt_start_pos = cc.moveTo(0, start_pos);
            var action_mt_end_pos = cc.moveTo(during, end_pos).easing(cc.easeElasticOut(1.0));
            var action_call = cc.callFunc(function(target){
                if (null != cb) {
                    cb();
                }
            }.bind(this), this);

            //同时进行
            //var action_spawn = cc.spawn(action_fi, action_mt_end_pos);
            //顺序进行
            var action_seq = cc.sequence(action_mt_start_pos, action_mt_end_pos, action_call);

            view.stopAllActions();
            view.runAction(action_seq);
            
        } else if (!inOut && view.active == true) {//退出

            var action_mt_start_pos = cc.moveTo(during, start_pos).easing(cc.easeElasticIn(1.0));
            var action_call = cc.callFunc(function(target){
                view.active = false;
                if (null != cb) {
                    cb();
                }
            }.bind(this), this);

            //同时进行
            //var action_spawn = cc.spawn(action_fi, action_mt_start_pos);
            //顺序进行
            var action_seq = cc.sequence(action_mt_start_pos, action_call);
            view.stopAllActions();
            view.runAction(action_seq);
        }
    },

});
