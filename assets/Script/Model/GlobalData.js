/*
功能：全局变量
说明：
*/
var CONSTANTS = require("Constants");
var BigRoad = require("BigRoad");

var GlobalData = {

    properties: {
        unit_bet_money: 0,//每单元下注额
        martegal_continue_lose_cnt: 0,//连续输的个数
        gride_size: null,
        virtual_node: null,
        big_road:null,
    },

    //初始化
    init() {
        this.unit_bet_money = 10;
        this.martegal_continue_lose_cnt = 4;
        this.gride_size = { width: 40, height: 40, };
        this.virtual_node = { number: 0, bet_amount: 0, bet_area: 0, result_area: 0, x: 0, y: 0, };
        this.big_road = new BigRoad();
    },
};

module.exports = GlobalData;
