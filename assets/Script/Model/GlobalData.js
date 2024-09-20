/*
功能：全局变量
说明：
*/
var CONSTANTS = require("Constants");

var GlobalData = {

    properties: {
        unit_amount:0,//每单元下注
        martegal_continue_lose_cnt:0,//连续输的个数
        gride_size:null,
        virtual_node:null,
    },

    //初始化
    init() {
        this.unit_amount = 10;
        this.martegal_continue_lose_cnt = 4;
        this.gride_size = {width:40, height:40,};
        this.virtual_node = {number:0, bet_amount: 0, bet_area: 0, result_area: 0, x:0, y:0,};
    },
};

module.exports = GlobalData;
