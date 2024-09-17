/*
功能：友元定义
说明：
*/

var EnumDefine = {
    
    //下注区类型
    AREA_TYPE: cc.Enum({
        NULL: 0,//无效
        PLAYER: 0x01,//闲
        TIE: 0x02, //和
        BANKER: 0x04, //庄
        PLAYER_PAIR: 0x08,//闲对
        BANKER_PAIR: 0x10,//庄对
    }),

    
};


module.exports = EnumDefine;
