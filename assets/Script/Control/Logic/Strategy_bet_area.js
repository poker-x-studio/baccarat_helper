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
    //查询虚拟节点
    query_virtual_node(){
        return {bet_area:EnumDefine.AREA_TYPE.BANKER,bet_amount:100,result_area:EnumDefine.AREA_TYPE.BANKER,};
    },
};

module.exports = Strategy_bet_area;

