/*
功能：跟随形态检测
说明：
*/  
var EnumDefine = require("EnumDefine");

var StyleFollow = {};

// 默认的形态  
// 跟从形态检测  
StyleFollow.checkFollowStyle = function (nodes) {  
    const node_cnt = nodes.length;  
    if (node_cnt <= 0) {  
        return {is_ok:true,  suggestion:{  
            style: EnumDefine.STYLE_TYPE.FOLLOW,  
            bet_area: EnumDefine.AREA_TYPE.BANKER,  
            comment: "默认跟随下注",  
            alert: false  
        }};  
    }  

    return {is_ok:true, suggestion:{  
        style: EnumDefine.STYLE_TYPE.FOLLOW,  
        bet_area: nodes[node_cnt - 1].result_area,  
        comment: "默认跟随下注",  
        alert: false  
    }};  
}  


module.exports = StyleFollow;

