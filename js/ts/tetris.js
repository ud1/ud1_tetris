var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "react", "react-dom"], function (require, exports, React, ReactDOM) {
    "use strict";
    var CELL_SIZE = 30;
    var BORDER = 5;
    var displayStyle = {
        fill: "#888"
    };
    var fieldStyle = {
        fill: "#222"
    };
    var topCellStyle = {
        fill: "#eee"
    };
    var leftCellStyle = {
        fill: "#ccc"
    };
    var centerCellStyle = {
        fill: "#aaa"
    };
    var rightCellStyle = {
        fill: "#888"
    };
    var bottomCellStyle = {
        fill: "#666"
    };
    var scoreStyle = {
        fill: "#fff"
    };
    var renderCell = function (className, p) {
        var lp = "0 0, " + BORDER + " " + BORDER + ", " + BORDER + " " + (CELL_SIZE - BORDER) + ", 0 " + CELL_SIZE;
        var tp = "0 0, " + CELL_SIZE + " " + 0 + ", " + (CELL_SIZE - BORDER) + " " + BORDER + ", " + BORDER + " " + BORDER;
        var rp = CELL_SIZE + " " + 0 + ", " + CELL_SIZE + " " + CELL_SIZE + ", " + (CELL_SIZE - BORDER) + " " + (CELL_SIZE - BORDER) + " " + (CELL_SIZE - BORDER) + " " + BORDER;
        var bp = 0 + " " + CELL_SIZE + ", " + BORDER + " " + (CELL_SIZE - BORDER) + ", " + (CELL_SIZE - BORDER) + " " + (CELL_SIZE - BORDER) + " " + CELL_SIZE + " " + CELL_SIZE;
        return React.createElement("g", { transform: "translate(" + p.x * CELL_SIZE + ", " + p.y * CELL_SIZE + ")" },
            React.createElement("polygon", { style: leftCellStyle, points: lp }),
            React.createElement("polygon", { style: topCellStyle, points: tp }),
            React.createElement("polygon", { style: rightCellStyle, points: rp }),
            React.createElement("polygon", { style: bottomCellStyle, points: bp }),
            React.createElement("rect", { style: centerCellStyle, x: BORDER, y: BORDER, width: CELL_SIZE - 2 * BORDER, height: CELL_SIZE - 2 * BORDER }));
    };
    var FIG1 = {
        points: [
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }
        ]
    };
    var FIG2 = {
        points: [
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }
        ]
    };
    var FIG3 = {
        points: [
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }
        ]
    };
    var FIG4 = {
        points: [
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }
        ]
    };
    var FIG5 = {
        points: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
        ]
    };
    var FIG6 = {
        points: [
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
        ]
    };
    var FIG7 = {
        points: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }
        ]
    };
    var ROT = [
        [{ x: 1, y: 0 }, { x: 0, y: 1 }],
        [{ x: 0, y: 1 }, { x: -1, y: 0 }],
        [{ x: -1, y: 0 }, { x: 0, y: -1 }],
        [{ x: 0, y: -1 }, { x: 1, y: 0 }]
    ];
    var ALL_FIGS = [
        FIG1,
        rotate(FIG1, 1),
        FIG2,
        rotate(FIG2, 1),
        rotate(FIG2, 2),
        rotate(FIG2, 3),
        FIG3,
        rotate(FIG3, 1),
        rotate(FIG3, 2),
        rotate(FIG3, 3),
        FIG4,
        rotate(FIG4, 1),
        rotate(FIG4, 2),
        rotate(FIG4, 3),
        FIG5,
        rotate(FIG5, 1),
        FIG6,
        rotate(FIG6, 1),
        FIG7,
        rotate(FIG7, 1),
    ];
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function dot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    }
    function mul(p1, v) {
        return { x: p1.x * v, y: p1.y * v };
    }
    function add(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    }
    function rotate(fig, rot) {
        var res = {
            points: fig.points.map(function (p) {
                return add(mul(ROT[rot][0], p.x), mul(ROT[rot][1], p.y));
            })
        };
        return res;
    }
    function moveFig(fig, dp) {
        var res = {
            points: fig.points.map(function (p) {
                return add(p, dp);
            })
        };
        return res;
    }
    function renderFig(fig, pos, result) {
        fig.points.forEach(function (p) {
            result.push(renderCell("", add(p, pos)));
        });
        return result;
    }
    var GameState;
    (function (GameState) {
        GameState[GameState["RUNNING"] = 0] = "RUNNING";
        GameState[GameState["END"] = 1] = "END";
    })(GameState || (GameState = {}));
    var FieldState = (function () {
        function FieldState(w, h) {
            var _this = this;
            this.w = w;
            this.h = h;
            this.move = function (dp) {
                if (!_this.currentFig)
                    return true;
                var newPos = add(_this.figPos, dp);
                var newFig = moveFig(_this.currentFig, newPos);
                if (_this.isFit(newFig)) {
                    _this.figPos = newPos;
                    return true;
                }
                return false;
            };
            this.tick = function () {
                if (_this.state == GameState.RUNNING) {
                    if (!_this.move({ x: 0, y: 1 }))
                        _this.frizeFig();
                }
            };
            this.rotate = function (rot) {
                if (!_this.currentFig)
                    return true;
                var rotFig = rotate(_this.currentFig, rot);
                var newFig = moveFig(rotFig, _this.figPos);
                if (_this.isFit(newFig)) {
                    _this.currentFig = rotFig;
                    return true;
                }
                return false;
            };
            this.processKey = function (key) {
                if (_this.state == GameState.RUNNING) {
                    if (key === "ArrowLeft")
                        _this.move({ x: -1, y: 0 });
                    if (key === "ArrowRight")
                        _this.move({ x: 1, y: 0 });
                    if (key === " ") {
                        if (!_this.move({ x: 0, y: 1 }))
                            _this.frizeFig();
                    }
                    if (key === "ArrowDown")
                        _this.rotate(1);
                    if (key === "ArrowUp")
                        _this.rotate(3);
                }
            };
            this.frizeFig = function () {
                var newFig = moveFig(_this.currentFig, _this.figPos);
                for (var _i = 0, _a = newFig.points; _i < _a.length; _i++) {
                    var p = _a[_i];
                    _this.cells[p.x][p.y] = true;
                }
                var deleteCount = 0;
                for (var y = _this.h - 1; y >= 0;) {
                    var deleteRow = true;
                    for (var x = 0; x < _this.w; x++) {
                        if (!_this.cells[x][y]) {
                            deleteRow = false;
                            break;
                        }
                    }
                    if (deleteRow) {
                        ++deleteCount;
                        for (var y2 = y - 1; y2 >= 0; y2--) {
                            for (var x = 0; x < _this.w; x++) {
                                _this.cells[x][y2 + 1] = _this.cells[x][y2];
                            }
                        }
                        for (var x = 0; x < _this.w; x++) {
                            _this.cells[x][0] = false;
                        }
                    }
                    else {
                        y--;
                    }
                }
                if (deleteCount == 1)
                    _this.score += 50;
                if (deleteCount == 2)
                    _this.score += 150;
                if (deleteCount == 3)
                    _this.score += 300;
                if (deleteCount == 4)
                    _this.score += 500;
                if (_this.setCurFig()) {
                    _this.generateNextFig();
                    return;
                }
                _this.state = GameState.END;
            };
            this.setCurFig = function () {
                for (var i = 0; i < 3; ++i) {
                    _this.figPos = { x: _this.w / 2, y: i };
                    var newFig = moveFig(_this.nextFig, _this.figPos);
                    if (_this.isFit(newFig)) {
                        _this.currentFig = _this.nextFig;
                        return true;
                    }
                }
                false;
            };
            this.generateNextFig = function () {
                _this.nextFig = ALL_FIGS[getRandomInt(0, ALL_FIGS.length)];
            };
            this.isFit = function (fig) {
                for (var _i = 0, _a = fig.points; _i < _a.length; _i++) {
                    var p = _a[_i];
                    if (!_this.isPointFit(p))
                        return false;
                }
                return true;
            };
            this.isPointFit = function (p) {
                return p.x >= 0 && p.x < _this.w && p.y >= 0 && p.y < _this.h &&
                    !_this.cells[p.x][p.y];
            };
            this.state = GameState.RUNNING;
            this.score = 0;
            this.cells = [];
            for (var i = 0; i < w; ++i) {
                this.cells[i] = [];
                for (var j = 0; j < h; ++j)
                    this.cells[i][j] = false;
            }
            this.generateNextFig();
            this.setCurFig();
            this.generateNextFig();
        }
        return FieldState;
    }());
    var TetrisField = (function (_super) {
        __extends(TetrisField, _super);
        function TetrisField() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TetrisField.prototype.render = function () {
            var cells = [];
            for (var i = 0; i < this.props.field.w; ++i) {
                for (var j = 0; j < this.props.field.h; ++j) {
                    if (this.props.field.cells[i][j])
                        cells.push(renderCell("", { x: i, y: j }));
                }
            }
            if (this.props.field.currentFig) {
                renderFig(this.props.field.currentFig, this.props.field.figPos, cells);
            }
            var cells2 = [];
            if (this.props.field.nextFig) {
                renderFig(this.props.field.nextFig, { x: 2, y: 2 }, cells2);
            }
            var displayW = this.props.field.w + 5;
            return React.createElement("div", null,
                React.createElement("svg", { width: displayW * CELL_SIZE + 6 * BORDER, height: this.props.field.h * CELL_SIZE + 2 * BORDER },
                    React.createElement("rect", { style: displayStyle, width: displayW * CELL_SIZE + 6 * BORDER, height: this.props.field.h * CELL_SIZE + 2 * BORDER }),
                    React.createElement("rect", { style: fieldStyle, width: this.props.field.w * CELL_SIZE + 2 * BORDER, height: this.props.field.h * CELL_SIZE + 2 * BORDER }),
                    React.createElement("g", { transform: "translate(" + (this.props.field.w + 3) * CELL_SIZE + ", " + CELL_SIZE + ")" },
                        React.createElement("text", { y: "1em", textAnchor: "middle", fontSize: 1.5 * CELL_SIZE, style: scoreStyle }, "Score"),
                        React.createElement("text", { y: "2em", textAnchor: "middle", fontSize: 1.5 * CELL_SIZE, style: scoreStyle }, this.props.field.score)),
                    React.createElement("g", { transform: "translate(" + BORDER + ", " + BORDER + ")" }, cells),
                    React.createElement("g", { transform: "translate(" + (this.props.field.w * CELL_SIZE + 3 * BORDER) + ", " + ((this.props.field.h - 5) * CELL_SIZE - BORDER) + ")" },
                        React.createElement("rect", { style: fieldStyle, width: 5 * CELL_SIZE + 2 * BORDER, height: 5 * CELL_SIZE + 2 * BORDER }),
                        React.createElement("g", { transform: "translate(" + BORDER + ", " + BORDER + ")" }, cells2))));
        };
        return TetrisField;
    }(React.Component));
    function render() {
        var field = new FieldState(10, 15);
        var render = function () {
            var content = React.createElement(TetrisField, { field: field });
            ReactDOM.render(content, document.getElementById("container"));
        };
        render();
        document.addEventListener('keydown', function (event) {
            field.processKey(event.key);
            render();
        }, false);
        setInterval(function () {
            field.tick();
            render();
            render();
        }, 500);
    }
    exports.render = render;
});
