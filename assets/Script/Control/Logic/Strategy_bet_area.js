/*
功能：下注区策略
说明：
*/  
var EnumDefine = require("EnumDefine");

var Strategy_bet_area = {

    properties: {
    },

    //初始化
    init() {
    },
    //查询下注区
    query_bet_area(){
        return EnumDefine.AREA_TYPE.BANKER;
    },
};

module.exports = Strategy_bet_area;

