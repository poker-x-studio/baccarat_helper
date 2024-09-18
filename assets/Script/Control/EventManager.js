/*
功能：事件管理
说明：组件销毁需要注销 事件监听
*/

var EventManager = {
    _dir: {},
    // 记录保存我们的订阅者;
    // handler(event_name, udata)
    add_listener(event_name, handler) { // 订阅事件
        if (this._dir[event_name]) {
            this._dir[event_name].push(handler);
        }
        else {
            this._dir[event_name] = [handler];
        }
    },

    dispatch_event(event_name, udata) { // 发送事件
        if (!this._dir[event_name]) {
            return;
        }

        for (var i = 0; i < this._dir[event_name].length; i++) {
            this._dir[event_name][i](event_name, udata);
        }
    },

    remove_listener(event_name, handler) { // 取消订阅
        if (!this._dir[event_name]) {
            return;
        }

        var index = this._dir[event_name].indexOf(handler);
        if (index >= 0) {
            this._dir[event_name].splice(index, 1);
            if (this._dir[event_name].length <= 0) {
                this._dir[event_name] = null;
            }
        }
    }
};

module.exports = EventManager;