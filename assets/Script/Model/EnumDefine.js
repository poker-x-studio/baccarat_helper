/*
功能：友元定义
说明：
*/

var EnumDefine = {

    //view类型
    VIEW_TYPE: cc.Enum({
        LAUNCH: 0,//启动视图
        MAIN: 2, //主视图
    }),

    //下注区类型
    AREA_TYPE: cc.Enum({
        NULL: 0,//无效
        PLAYER: 0x01,//闲
        TIE: 0x02, //和
        BANKER: 0x04, //庄
        PLAYER_PAIR: 0x08,//闲对
        BANKER_PAIR: 0x10,//庄对
    }),
    area_type_2_string(area_type){
        var list = [
            {area:this.AREA_TYPE.NULL,str:"无效"},
            {area:this.AREA_TYPE.PLAYER,str:"闲"},
            {area:this.AREA_TYPE.TIE,str:"和"},
            {area:this.AREA_TYPE.BANKER,str:"庄"},
            {area:this.AREA_TYPE.PLAYER_PAIR,str:"闲对"},
            {area:this.AREA_TYPE.BANKER_PAIR,str:"庄对"},
        ];
        for(var i=0; i<list.length; i++){
            if(area_type == list[i].area){
                return list[i].str;
            }
        }
        return "";
    },

    //形态类型
    STYLE_TYPE: cc.Enum({
        NULL: 0,//无效
        FOLLOW: 0x01,//跟从形态
        REVERSE: 0x02, //相反形态
        LONG: 0x03, //龙形态
        MM_JUMP: 0x04,//MM跳形态
        MN_JUMP: 0x05,//MN跳形态
    }),


};


module.exports = EnumDefine;
