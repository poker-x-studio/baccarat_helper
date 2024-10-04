/*
功能：便利功能集成
说明：
*/
const Utils = {};

//得到子节点屏幕坐标
Utils.childNodeWorldSpace = function (node) {
	if (node == null) {
		return cc.v2(0, 0);
	}
	var ls = cc.v2(node.x, node.y);
	var ws = node.parent.convertToWorldSpaceAR(ls);
	return ws;
};

//深度clone对象
Utils.cloneObj = function (obj) {
	var o = (obj && obj.constructor === Array) ? [] : {};
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (!obj[i]) { o[i] = obj[i]; continue; }
			o[i] = (typeof obj[i] === "object") ? Utils.cloneObj(obj[i]) : obj[i];
		}
	}
	return o;
};

//函数会拷贝所有自有属性的属性描述符
Utils.completeAssign = function (target, ...sources) {
	sources.forEach(source => {
		let descriptors = Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
			return descriptors;
		}, {});

		// Object.assign 默认也会拷贝可枚举的Symbols
		Object.getOwnPropertySymbols(source).forEach(sym => {
			let descriptor = Object.getOwnPropertyDescriptor(source, sym);
			if (descriptor.enumerable) {
				descriptors[sym] = descriptor;
			}
		});
		Object.defineProperties(target, descriptors);
	});
	return target;
};

//获取随机数
Utils.getRandomNum = function (minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
		default:
			return 0;
	}
};

Utils.inArray = function (obj, arr) {
	var i = arr.length;
	while (i--) {
		if (parseInt(arr[i]) === parseInt(obj)) {
			return true;
		}
	}
	return false;
};

//设置数字格式
Utils.setNumFormat = function (num) {
	if (!num) {
		return;
	}
	// K、M、G、T---->k m b t aa ab ac
	if (num / 1000000000000000000000 >= 1) {
		// return (num / 1000000000000000000000).toFixed(2) + 'ac';
		return ((Math.floor(num * 100) / 100) / 1000000000000000000000).toFixed(2) + 'ac';
	} else if (num / 1000000000000000000 >= 1) {
		// return (num / 1000000000000000000).toFixed(2) + 'ab';
		return ((Math.floor(num * 100) / 100) / 1000000000000000000).toFixed(2) + 'ab';
	} else if (num / 1000000000000000 >= 1) {
		// return (num / 1000000000000000).toFixed(2) + 'aa';
		return ((Math.floor(num * 100) / 100) / 1000000000000000).toFixed(2) + 'aa';
	} else if (num / 1000000000000 >= 1) {
		// return (num / 1000000000000).toFixed(2) + 't';
		return ((Math.floor(num * 100) / 100) / 1000000000000).toFixed(2) + 't';
	} else if (num / 1000000000 >= 1) {
		// return (num / 1000000000).toFixed(2) + 'b';
		return ((Math.floor(num * 100) / 100) / 1000000000).toFixed(2) + 'b';
	} else if (num / 1000000 >= 1) {
		// return (num / 1000000).toFixed(2) + 'm';
		return ((Math.floor(num * 100) / 100) / 1000000).toFixed(2) + 'm';
	} else if (num / 1000 >= 1) {
		// return (num / 1000).toFixed(2) + 'k';
		return ((Math.floor(num * 100) / 100) / 1000).toFixed(2) + 'k';
	} else {
		return (Math.floor(num * 100) / 100).toFixed(2);
	}
	// else {
	//     return 0;
	// }
}

module.exports = Utils;
