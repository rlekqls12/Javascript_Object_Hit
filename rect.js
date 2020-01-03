var __cvs, _ctx;
var _mouse = [0, 0, false], _keys = {};
var _rects = [], _isDrawing = false;

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

    // canvas style setting
    this._ctx.fillStyle = "#99ff9980";
    this._ctx.strokeStyle = "#99ff99af";
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
        _rects.push({
            x: _mouse[0],
            y: _mouse[1],
            w: _mouse[0],
            h: _mouse[1],
            mass: 0,
            gravity: 0
        });
        _isDrawing = true;
    }
    // 드래그 하는 곳으로 두번째 지점 이동
    if (_mouse[2] && _isDrawing) {
        var rect = _rects[_rects.length - 1];
        rect.w = _mouse[0] - rect.x;
        rect.h = _mouse[1] - rect.y;
    }
    // 두번째 지점 생성 완료
    if (!_mouse[2] && _isDrawing) {
        var rect = _rects[_rects.length - 1];
        rect.w = _mouse[0] - rect.x;
        rect.h = _mouse[1] - rect.y;

        // 음수 처리
        if (rect.w < 0) {
            rect.x += rect.w;
            rect.w *= -1;
        }
        if (rect.h < 0) {
            rect.y += rect.h;
            rect.h *= -1;
        }

        rect.mass = (rect.w + rect.h) / 1.2;
        _isDrawing = false;

        // 생성된 네모의 가로 세로가 10를 넘지 않으면 삭제
        if (rect.w < 10 && rect.h < 10)
            _rects.pop();
    }

    // gravity
    for (var i = 0, rect; i < _rects.length; i++) {
        rect = _rects[i];

        rect.gravity += rect.mass * 0.00098;
        rect.y += rect.gravity;

        if (_cvs.height < rect.y + rect.h) {
            rect.y = _cvs.height - rect.h;
            rect.gravity = 0;
        }
    }

    checkObjectsCrash();

    draw();
}

function draw() {
    _ctx.clearRect(0, 0, _cvs.width, _cvs.height);

    for (var i = 0; i < _rects.length; i++) {
        _ctx.beginPath();
        _ctx.fillRect(_rects[i].x, _rects[i].y, _rects[i].w, _rects[i].h);
        _ctx.fill();
        _ctx.stroke();
        _ctx.closePath();
    }
}

//////////////////////////////////////////////////// Calc Func ///////////////////////////////////////////////////////

function checkObjectsCrash() {
    var i, j, r0, r1;
    for (i = 0; i < _rects.length; i++) {
        r0 = _rects[i];
        for (j = 0; j < _rects.length; j++) {
            if (i == j) continue;
            r1 = _rects[j];

            if (((r0.x <= r1.x && r1.x <= r0.x + r0.w) ||
                (r0.x <= r1.x + r1.w && r1.x + r1.w <= r0.x + r0.w)) &&
                ((r0.y <= r1.y && r1.y <= r0.y + r0.h) ||
                (r0.y <= r1.y + r1.h && r1.y + r1.h <= r0.y + r0.h))) {
                    // r0이 r1 위에 있을 경우
                    if (r0.y <= r1.y && r1.y <= r0.y + r0.h) {
                        r0.y = r1.y - r0.h;
                        r0.gravity = 0;
                    }
                    // r0이 r1 밑에 있을 경우
                    else if (r0.y <= r1.y + r1.h && r1.y +r1.h <= r0.y + r0.h) {
                        r1.y = r0.y - r1.h;
                        r1.gravity = 0;
                    }
                    // x좌표의 이동 없으니 계산 X
                }
        }
    }
}