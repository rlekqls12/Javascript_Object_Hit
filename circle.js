var __cvs, _ctx;
var _mouse = [0, 0, false], _keys = {};
var _cirs = [], _draw, _isDrawing = false;
var _toDeg = 180 / Math.PI, _toRad = Math.PI / 180;

window.onload = function() {
    _cvs = document.getElementById('cvs');
    _ctx = _cvs.getContext('2d');

    this.onresize();

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

window.onkeyup = function() {
    _keys[this.event.key.toLowerCase()] = undefined;
}

window.onkeydown = function() {
    _keys[this.event.key.toLowerCase()] = true;
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
    // 첫번째 지점 생성
    if (_mouse[2] && !_isDrawing) {
        _draw = {
            x: _mouse[0],
            y: _mouse[1],
            r: 10,
            mass: 0,
            pow: 0,
            ang: 0,
            rev: 0,
            color: (this.Math.floor(Math.random() * 899999) + 100000)
        };
        _isDrawing = true;
    }
    // 드래그 하는 곳으로 두번째 지점 이동
    if (_mouse[2] && _isDrawing) {
        _draw.x = _mouse[0];
        _draw.y = _mouse[1];
        _draw.r += 0.8;
    }
    // 두번째 지점 생성 완료
    if (!_mouse[2] && _isDrawing) {
        _draw.mass = _draw.r * 20;
        _cirs.push(_draw);
        _draw = undefined;
        _isDrawing = false;
    }

    // gravity
    for (var i = 0, cir; i < _cirs.length; i++) {
        cir = _cirs[i];

        addVectorPower(cir, cir.mass * 9.8, 90 * _toRad);

        if (_cvs.height < cir.y + cir.r) {
            cir.y = _cvs.height - cir.r;
            addVectorPower(cir, cir.pow, 270 * _toRad);
        }
    }

    checkObjectsCrash();

    // pow
    for (var i = 0, cir; i < _cirs.length; i++) {
        cir = _cirs[i];

        cir.x += (cir.pow / 8) * Math.cos(cir.obj);
        cir.y += (cir.pow / 8) * Math.sin(cir.obj);
        cir.pow *= 7/8;
    }

    draw();
}

function draw() {
    _ctx.clearRect(0, 0, _cvs.width, _cvs.height);

    for (var i = 0; i < _cirs.length; i++)
        drawObj(_cirs[i]);

    if (_draw != undefined)
        drawObj(_draw);
}

function drawObj(cir) {
    _ctx.fillStyle = "#" + cir.color + "64";
    _ctx.strokeStyle = "#" + cir.color + "80";
    _ctx.beginPath();
    _ctx.arc(cir.x, cir.y, cir.r, 0, 6.28, false);
    _ctx.fill();
    _ctx.stroke();
    _ctx.closePath();
}

//////////////////////////////////////////////////// Calc Func ///////////////////////////////////////////////////////

function checkObjectsCrash() {
    var i, j, c0, c1;
    for (i = 0; i < _cirs.length; i++) {
        c0 = _cirs[i];
        for (j = i + 1; j < _cirs.length; j++) {
            c1 = _cirs[j];
            if (Math.sqrt(Math.pow(c0.x - c1.x, 2) + Math.pow(c0.y - c1.y, 2)) <= c0.r + c1.r) {
                console.log('Crush');
            }
        }
    }
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