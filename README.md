# 项目说明
- 百家乐下注助手
- 工作室网站 [www.poker-x-studio.com](www.poker-x-studio.com)

## 一 功能说明:
  - 横屏，ui设计分辨率 1920*1080


## 二 技术栈
    - JavaScript语言开发
    - Cocos Creator 2.4.12 项目

## 三 github commit之间比较
 https://github.com/poker-x-studio/baccarat_helper/compare/49c83f4..1abff3f


 ## 四 编码规范
 - 4.1 变量名 小写+下划线 
    ```
    unit_bet_money: 0,//每单元下注额
    ```
 - 4.2 函数名 小驼峰法标识, 即除第一个单词之外，其他单词首字母大写（ lowerCamelCase）
  ```
  areaType2String(area_type){
  },
  ``` 
 - 4.3 变量或函数前加_ 表示私有
  ```
  var EventManager = {
    _dir: {},//变量
  };

  _pushElement(node_item) {//函数
  },
  ```
 - 4.4 常量 (如 PI) 为大写 (UPPERCASE )
  ```
  //测试tag
  TAG: "baccarat_helper,JS project,",
  ```
 - 4.5 CocosCreator编辑器中规范
   - view 一般是 canvas 下一级的界面元素,通常会铺满屏幕
   - panel 一般是 view 下一级的界面元素
   - block 一般是 panel 下一级的界面元素
