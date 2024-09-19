/*
功能：全局变量
说明：
*/
var CONSTANTS = require("Constants");

var GlobalData = {

    properties: {
        gride_size:null,
    },

    //初始化
    init() {
        this.gride_size = {width:50, height:50,};
    },
};

module.exports = GlobalData;
