/*
功能：预制件-下拉控件
说明：
*/
var DropDownItem = require("DropDownItem");
var DropDownOptionData = require("DropDownOptionData");
var EVENT = require("Event");
var EventManager = require("EventManager");

var PrefabDropdownBox = cc.Class({
    extends: cc.Component,

    properties: {
        template: {
            type: cc.Node,
            default:null,
            tooltip: "item模板容器",
        },
        labelCaption: {
            type: cc.Label,
            default:null,
            tooltip: "标题字符",
        },
        spriteCaption: {
            type: cc.Sprite,
            default:null,
            tooltip: "标题精灵",
        },
        labelItem: {
            type: cc.Label,
            default:null,
            tooltip: "",
        },
        spriteItem: {
            type: cc.Sprite,
            default:null,
            tooltip: "",
        },
        optionDatas: {
            type: [DropDownOptionData],
            default: [],
            tooltip: "选项数据",
        },
        _dropDown: null,
        validTemplate: false,
        items: [DropDownItem],
        isShow: false,
        _selectedIndex: -1 //选择索引
    },

    //选择索引
    getSelectedIndex() {
        return this._selectedIndex;
    },
    setSelectedIndex(value) {
        this._selectedIndex = value;
        this.refreshShownValue();
    },

    //添加选项数据
    addOptionDatas(optionDatas) {
        if (optionDatas) {
            optionDatas.forEach(data => {
                this.optionDatas.push(data);
            });
        }
        this.refreshShownValue();
    },
    //清除选项数据
    clearOptionDatas() {
        cc.js.clear(this.optionDatas);
        this.refreshShownValue();
    },

    show() {
        if (!this.validTemplate) {
            this.setUpTemplate();
            if (!this.validTemplate) { return; }
        }
        this.isShow = true;

        this._dropDown = this.createDropDownList(this.template);
        this._dropDown.name = "DropDown List";
        this._dropDown.active = true;
        this._dropDown.setParent(this.template.parent);

        let itemTemplate = this._dropDown.getComponentInChildren('DropDownItem');
        let content = itemTemplate.node.parent;
        itemTemplate.node.active = true;

        cc.js.clear(this.items);

        for (let i = 0, len = this.optionDatas.length; i < len; i++) {
            let data = this.optionDatas[i];
            let item = this.addItem(data, i === this.getSelectedIndex(), itemTemplate, this.items);
            if (!item) {
                continue;
            }
            item.toggle.isChecked = i === this.getSelectedIndex();
            item.toggle.node.on("toggle", this.onSelectedItem, this);
        }
        itemTemplate.node.active = false;

        content.height = itemTemplate.node.height * this.optionDatas.length;
    },

    addItem(data, selected, itemTemplate, dropDownItems) {
        let item = this.createItem(itemTemplate);
        item.node.setParent(itemTemplate.node.parent);
        item.node.active = true;
        item.node.name = `item_${this.items.length + (data.optionString ? data.optionString : "")}`;
        if (item.toggle) {
            item.toggle.isChecked = false;
        }
        if (item.label) {
            item.label.string = data.optionString;
        }
        if (item.sprite) {
            item.sprite.spriteFrame = data.optionSf;
            item.sprite.enabled = data.optionSf !== undefined;
        }
        this.items.push(item);
        return item;
    },

    hide() {
        this.isShow = false;
        if (this._dropDown) {
            this.delayedDestroyDropdownList(0.15);
        }
    },

    delayedDestroyDropdownList(delay) {
        setTimeout(() => {
            for (let i = 0, len = this.items.length; i < len; i++) {
                if (this.items[i]) this.destroyItem(this.items[i]);
            }
            cc.js.clear(this.items);
            if (this._dropDown) this.destroyDropDownList(this._dropDown);
            this._dropDown = null;
        }, delay * 1000);
    },

    destroyItem(item) {
        // Implement destroy logic here
    },

    setUpTemplate() {
        this.validTemplate = false;

        if (!this.template) {
            cc.error("The dropdown template is not assigned. The template needs to be assigned and must have a child Node with a Toggle component serving as the item.");
            return;
        }
        this.template.active = true;
        let itemToggle = this.template.getComponentInChildren(cc.Toggle);
        this.validTemplate = true;

        if (!itemToggle || itemToggle.node === this.template) {
            this.validTemplate = false;
            cc.error("The dropdown template is not valid. The template must have a child Node with a Toggle component serving as the item.");
        } else if (this.labelItem && !this.labelItem.node.isChildOf(itemToggle.node)) {
            this.validTemplate = false;
            cc.error("The dropdown template is not valid. The Item Label must be on the item Node or children of it.");
        } else if (this.spriteItem && !this.spriteItem.node.isChildOf(itemToggle.node)) {
            this.validTemplate = false;
            cc.error("The dropdown template is not valid. The Item Sprite must be on the item Node or children of it.");
        }

        if (!this.validTemplate) {
            this.template.active = false;
            return;
        }

        let item = itemToggle.node.addComponent('DropDownItem');
        item.label = this.labelItem;
        item.sprite = this.spriteItem;
        item.toggle = itemToggle;
        item.node = itemToggle.node;

        this.template.active = false;
        this.validTemplate = true;
    },

    refreshShownValue() {
        if (this.optionDatas.length <= 0) {
            return;
        }
        let data = this.optionDatas[this.clamp(this.getSelectedIndex(), 0, this.optionDatas.length - 1)];
        if (this.labelCaption) {
            if (data && data.optionString) {
                this.labelCaption.string = data.optionString;
            } else {
                this.labelCaption.string = "";
            }
        }
        if (this.spriteCaption) {
            if (data && data.optionSf) {
                this.spriteCaption.spriteFrame = data.optionSf;
            } else {
                this.spriteCaption.spriteFrame = undefined;
            }
            this.spriteCaption.enabled = this.spriteCaption.spriteFrame !== undefined;
        }
        EventManager.dispatchEvent(EVENT.EVENT_NAME_DROP_DOWN_BOX_SELECTED, null);
    },

    createDropDownList(template) {
        return cc.instantiate(template);
    },

    destroyDropDownList(dropDownList) {
        dropDownList.destroy();
    },

    createItem(itemTemplate) {
        let newItem = cc.instantiate(itemTemplate.node);
        return newItem.getComponent('DropDownItem');
    },

    onSelectedItem(toggle) {
        let parent = toggle.node.parent;
        for (let i = 0; i < parent.childrenCount; i++) {
            if (parent.children[i] === toggle.node) {
                this.setSelectedIndex(i - 1);
                console.log("this.getSelectedIndex():", this.getSelectedIndex());
                break;
            }
        }
        this.hide();
    },

    //点击
    onClick() {
        if (!this.isShow) {
            this.show();
        } else {
            this.hide();
        }
    },

    start() {
        this.template.active = false;
        this.refreshShownValue();
    },

    onEnable() {
        this.node.on("touchend", this.onClick, this);
    },

    onDisable() {
        this.node.off("touchend", this.onClick, this);
    },

    clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
});

module.exports = PrefabDropdownBox;