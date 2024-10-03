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

        res_total_cnt :0, //资源总个数
        prefab_name_list:[],//预制件名称
    },

    onLoad() {
        this.res_total_cnt = 0;
        this.prefab_list = {};
    },

    //预加载所有预制件
    preload_prefab(){
        this.prefab_name_list = [
            CONSTANTS.PREFAB_ALERT,
            CONSTANTS.PREFAB_BIGROAD_NODE,
            CONSTANTS.PREFAB_BIGROAD_VIRTUAL_NODE,
            CONSTANTS.PREFAB_BIGROAD_INDEX,
            CONSTANTS.PREFAB_BANKER,
        ];
        for(var i=0; i<this.prefab_name_list.length; i++){
            this.load_prefab(this.prefab_name_list[i]);
        }
    },
    //加载
    load_prefab(prefab_name, cb) {
        if(this.prefab_list[prefab_name] != null){
            if(cb != null){//回调
                cb(this.prefab_list[prefab_name]);
            }
            return ;
        }
        cc.assetManager.loadBundle("Resources", function (err, bundle) {
            var self = this;
            if (err) {
                console.error(CONSTANTS.TAG,'cc.assetManager.loadBundle err : ', err, ',prefab_name:',prefab_name);
                return;
            }
            bundle.load(prefab_name, cc.prefab, function (err, prefab) {
                if (err) {
                    console.error(CONSTANTS.TAG,'bundle.load err : ', err, ',prefab_name:',prefab_name);
                    return;
                }
                self.prefab_list[prefab_name] = prefab;
                console.log(CONSTANTS.TAG, '加载预制件,成功: ', prefab_name);
                if(cb != null){//回调
                    cb(self.prefab_list[prefab_name]);
                }
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

    //获取记载进度
    get_load_progress(){
        //资源总个数
        this.res_total_cnt = this.prefab_name_list.length;

        //计算已经加载个数
        var res_loaded_cnt = 0;
        for(var i=0; i<this.prefab_name_list.length; i++){
            var prefab_name = this.prefab_name_list[i];
            if(this.prefab_list[prefab_name] != null){
                res_loaded_cnt++;
            }
        }
        console.log(CONSTANTS.TAG, "this.res_total_cnt:", this.res_total_cnt, ",res_loaded_cnt:", res_loaded_cnt);
        return res_loaded_cnt/this.res_total_cnt;
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
