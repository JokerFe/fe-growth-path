//将tools定义为window对象的属性，该属性的值是一个对象
window.lvye = {};
window.tools = {};
//获取鼠标指针位置
window.tools.getMouse = function (element) {
    //定义一个mouse的对象
    var mouse = { x: 0, y: 0 };
    //为传入的元素添加mousemove事件
    element.addEventListener('mousemove', function (e) {
        var x, y;
        //在IE中，event对象是作为window对象的一个属性存在
        var e = e || window.event;
        //获取鼠标指针当前位置，并作兼容处理
        //兼容Firefox、chrome、IE9及以上
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        //兼容IE8及以下，以及混杂模式下的Chrome和Safari
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        //将当前的坐标值减去canvas元素的偏移位置，则x、y为鼠标指针在canvas中的相对坐标值
        x -= element.offsetLeft;
        y -= element.offsetTop;
        mouse.x = x;
        mouse.y = y;
    });
    //返回值为mouse对象
    return mouse;
};

//获取键盘控制方向
window.tools.getKey = function () {
    var key = {};
    window.addEventListener(
        'keydown',
        function (e) {
            if (e.keyCode == 38 || e.keyCode == 87) {
                key.direction = 'up';
            } else if (e.keyCode == 39 || e.keyCode == 68) {
                key.direction = 'right';
            } else if (e.keyCode == 40 || e.keyCode == 83) {
                key.direction = 'down';
            } else if (e.keyCode == 37 || e.keyCode == 65) {
                key.direction = 'left';
            } else {
                key.direction = '';
            }
        },
        false
    );
    return key;
};
