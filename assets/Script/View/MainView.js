var EnumDefine = require("EnumDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        circle: {
            default: null,
            type: cc.Graphics,
        },           
    },

    // use this for initialization
    onLoad: function () {
        window.app.viewManager.alert("ddd");

        this.test_big_road_node();
    },

     //弹窗
     test_big_road_node() {
        cc.assetManager.loadBundle("Resources", function (err, bundle) {
            if (err) {
                console.log('cc.assetManager.loadBundle err : ', err);
                return;
            }
            bundle.load("prefab/prefabBigRoadNode", cc.prefab, function (err, prefab) {
                if (err) {
                    console.log('bundle.load err : ', err);
                    return;
                }
                var node1 = cc.instantiate(prefab);
                node1.x = 0;
                node1.y = 180;
                node1.getComponent('PrefabBigRoadNode').setInfo(1, EnumDefine.AREA_TYPE.BANKER, EnumDefine.AREA_TYPE.PLAYER);
                cc.find('Canvas').addChild(node1, 10);

                var node2 = cc.instantiate(prefab);
                node2.x = 0;
                node2.y = 100;
                node2.getComponent('PrefabBigRoadNode').setInfo(2, EnumDefine.AREA_TYPE.PLAYER, EnumDefine.AREA_TYPE.PLAYER);
                cc.find('Canvas').addChild(node2, 10);

            })
        })
    }, 
   
    // called every frame
    update: function (dt) {

    },
});
