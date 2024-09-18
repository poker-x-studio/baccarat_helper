/*
功能：资源管理
说明：
*/

cc.Class({
    extends: cc.Component,

    properties: {
        prefab_bigroad_node: {
            type: cc.Prefab,
            default: null,
            tooltip: "大路节点预制件预制件",
        },
        json: {
            default: {},
            tooltip: "关卡json配置文件"
        },
        sprite_atlas: {
            default: {},
            tooltip: "关卡图集"
        },
    },

    onLoad() {
    },

    //加载大路节点预制件
    load_prefab_bigroad_node() {
        cc.assetManager.loadBundle("Resources", function (err, bundle) {
            var self = this;
            if (err) {
                console.log('cc.assetManager.loadBundle err : ', err);
                return;
            }
            bundle.load("prefab/prefabBigRoadNode", cc.prefab, function (err, prefab) {
                if (err) {
                    console.log('bundle.load err : ', err);
                    return;
                }
                self.prefab_bigroad_node = prefab;
            }.bind(self));
        }.bind(this));
    },
    get_prefab_bigroad_node(){
        if (this.prefab_bigroad_node == null ){
            this.load_prefab_bigroad_node();
        }
        return this.prefab_bigroad_node;
    },

    //加载配置文件
    load_json(sid, lid, cb) {
        var path = "config/sessions/S" + sid + "Level" + lid + ".json";
        //console.log("load_json(),path="+path);
        if (this.json[path] != null) {//已经加载过
            if (cb != null) {
                //cc.log("从cache读取：" + path)
                cb(this.json[path]);
            }
        } else {//本次加载
            cc.loader.loadRes(path, function (err, result) {
                if (err) {
                    cc.error(err.message || err);
                    if (cb != null) {
                        cb(null);
                    }
                    return;
                }
                console.log("load_json(),path=" + path + ",successed");
                this.json[path] = result.json;
                if (cb != null) {
                    cb(result.json)
                }
            }.bind(this));
        }
    },

    //加载图集
    load_sprite_atlas(sid, cb) {
        var path = SessionConfig[sid].sprite_atlas;
        //console.log("load_sprite_atlas(),path="+path);
        if (this.sprite_atlas[path] != null) {//已经加载过
            if (cb != null) {
                //cc.log("从cache读取：" + path)
                cb(this.sprite_atlas[path]);
            }
        } else {//本次加载
            cc.loader.loadRes(path, cc.SpriteAtlas, function (err, spriteAtlas) {
                if (err) {
                    cc.error(err.message || err);
                    if (cb != null) {
                        cb(null);
                    }
                    return;
                }
                console.log("load_sprite_atlas(),path=" + path + ",successed");
                this.sprite_atlas[path] = spriteAtlas;
                if (cb != null) {
                    cb(spriteAtlas)
                }
            }.bind(this));
        }
    }

});
