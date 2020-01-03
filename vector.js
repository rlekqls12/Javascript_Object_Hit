var __cvs, _ctx;
var _mouse = [0, 0, false], _start = [0, 0];
var _obj = {
        x : 0,
        y : 0,
        pow : 0,
        ang : 0
    }, _isClickNow = false;
var _toDeg = 180 / Math.PI, _toRad = Math.PI / 180;

window.onload = function() {
    _cvs = document.getElementById('cvs');
    _ctx = _cvs.getContext('2d');

    this.onresize();

    this._obj.x = _cvs.width / 2;
    this._obj.y = _cvs.height / 2;

    this.setInterval(calc, 1000/60);
}

window.onresize = function() {
    var w = window.innerWidth,
        h = window.innerHeight,
        size = window.innerWidth;

    if (size > h)
        size = h;

    this._cvs.width = size;
    this._cvs.height = size;

    this._cvs.style.left = parseInt((w - size) / 2) + 'px';
    this._cvs.style.top = parseInt((h - size) / 2) + 'px';
}

window.onmouseup = function() {
    _mouse[2] = false;
}

window.onmousemove = function() {
    _mouse[0] = event.clientX - this.parseInt(_cvs.style.left);
    _mouse[1] = event.clientY - this.parseInt(_cvs.style.top);
}

window.onmousedown = function() {
    _mouse[2] = true;
}

function calc() {
    if (_mouse[2] && !_isClickNow) {
        _start[0] = _mouse[0] + 0;
        _start[1] = _mouse[1] + 0;
        _isClickNow = true;
    }
    if (!_mouse[2] && _isClickNow) {
        var pow, ang;
        pow = Math.sqrt(Math.pow(_mouse[0] - _start[0], 2) + Math.pow(_mouse[1] - _start[1], 2)) / 20;
        ang = -(90 * _toRad) - Math.atan2(_mouse[0] - _start[0], _mouse[1] - _start[1]);
        addVectorPower(_obj, pow, ang);
        _isClickNow = false;
    }

    _obj.x += _obj.pow * Math.cos(_obj.ang);
    _obj.y += _obj.pow * Math.sin(_obj.ang);

    if (_cvs.width < _obj.x)
        _obj.x = 0;
    if (0 > _obj.x)
        _obj.x = _cvs.width;
    if (_cvs.height < _obj.y)
        _obj.y = 0;
    if (0 > _obj.y)
        _obj.y = _cvs.height;

    draw();
}

function draw() {
    _ctx.clearRect(0, 0, _cvs.width, _cvs.height);

    _ctx.beginPath();
    _ctx.arc(_obj.x, _obj.y, 10, 0, 6.28, false);
    _ctx.fill();
    _ctx.closePath();
}

function addVectorPower(obj, pow, ang) {
    var x = 0, y = 0;
    x += obj.pow * Math.cos(obj.ang);
    y += obj.pow * Math.sin(obj.ang);
    x += pow * Math.cos(ang);
    y += pow * Math.sin(ang);

    obj.pow = Math.sqrt(Math.pow(0 - x, 2) + Math.pow(0 - y, 2));
    obj.ang = -(90 * _toRad) - Math.atan2(0 - x, 0 - y);
}