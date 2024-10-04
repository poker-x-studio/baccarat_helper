/*
功能：全局常量,配置信息
说明：
*/  
var CONSTANTS = {
    //测试tag
    TAG: "baccarat_helper,JS project,",
    //庄颜色
    CLR_BANKER: new cc.Color().fromHEX('#FF0000'),
    //闲颜色
    CLR_PLAYER: new cc.Color().fromHEX('#0000FF'),
    //和颜色
    CLR_TIE: new cc.Color().fromHEX('#98C047'),
    //空心圆线宽
    CIRCLE_LINE_WIDTH: 6,

    //预制件
    PREFAB_ALERT: "prefab/prefabAlert",
    PREFAB_BIGROAD_NODE: "prefab/prefabBigRoadNode",
    PREFAB_BIGROAD_VIRTUAL_NODE: "prefab/prefabBigRoadVirtualNode",
    PREFAB_BIGROAD_INDEX: "prefab/prefabBigRoadIndex",
    PREFAB_BANKER:"prefab/prefabBanker",
};


module.exports = CONSTANTS;
