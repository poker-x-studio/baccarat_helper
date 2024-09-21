/*
功能：资源管理
说明：
*/
var CONSTANTS = require("Constants");

cc.Class({
    extends: cc.Component,

    properties: {
        prefab_list:{
            default: {},
            tooltip: "预制件列表"
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
        this.prefab_list = {};
    },

    //预加载所有预制件
    preload_prefab(){
        var prefab_name_list = [
            CONSTANTS.PREFAB_BIGROAD_NODE,
            CONSTANTS.PREFAB_BIGROAD_VIRTUAL_NODE,
            CONSTANTS.PREFAB_BIGROAD_INDEX,
            CONSTANTS.PREFAB_BANKER,
        ];
        for(var i=0; i<prefab_name_list.length; i++){
            this.load_prefab(prefab_name_list[i]);
        }
    },
    //加载
    load_prefab(prefab_name) {
        cc.assetManager.loadBundle("Resources", function (err, bundle) {
            var self = this;
            if (err) {
                console.log('cc.assetManager.loadBundle err : ', err);
                return;
            }
            bundle.load(prefab_name, cc.prefab, function (err, prefab) {
                if (err) {
                    console.log('bundle.load err : ', err);
                    return;
                }
                self.prefab_list[prefab_name] = prefab;
            }.bind(self));
        }.bind(this));        
    },
    //获取
    get_prefab(prefab_name) {
        if(this.prefab_list[prefab_name] == null){
             this.load_prefab(prefab_name);
        }
        return this.prefab_list[prefab_name];
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
