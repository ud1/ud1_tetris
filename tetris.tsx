import * as React from "react"
import * as ReactDOM from "react-dom"

interface Point {
    x, y: number;
}

const CELL_SIZE = 30;
const BORDER = 5;

const displayStyle = {
    fill: "#888"
}

const fieldStyle = {
    fill: "#222"
}

const topCellStyle = {
    fill: "#eee"
}

const leftCellStyle = {
    fill: "#ccc"
}

const centerCellStyle = {
    fill: "#aaa"
}

const rightCellStyle = {
    fill: "#888"
}

const bottomCellStyle = {
    fill: "#666"
}

const scoreStyle = {
    fill: "#fff"
}

var renderCell = function(className: string, p: Point) {
    let lp = `0 0, ${BORDER} ${BORDER}, ${BORDER} ${CELL_SIZE - BORDER}, 0 ${CELL_SIZE}`;
    let tp = `0 0, ${CELL_SIZE} ${0}, ${CELL_SIZE - BORDER} ${BORDER}, ${BORDER} ${BORDER}`;
    let rp = `${CELL_SIZE} ${0}, ${CELL_SIZE} ${CELL_SIZE}, ${CELL_SIZE - BORDER} ${CELL_SIZE - BORDER} ${CELL_SIZE - BORDER} ${BORDER}`;
    let bp = `${0} ${CELL_SIZE}, ${BORDER} ${CELL_SIZE - BORDER}, ${CELL_SIZE - BORDER} ${CELL_SIZE - BORDER} ${CELL_SIZE} ${CELL_SIZE}`;
    return <g transform={`translate(${p.x * CELL_SIZE}, ${p.y * CELL_SIZE})`}>
        <polygon style={leftCellStyle} points={lp}/>
        <polygon style={topCellStyle} points={tp}/>
        <polygon style={rightCellStyle} points={rp}/>
        <polygon style={bottomCellStyle} points={bp}/>
        <rect style={centerCellStyle} x={BORDER} y={BORDER} width={CELL_SIZE - 2 * BORDER} height={CELL_SIZE - 2 * BORDER}/>
    </g>;
}

interface Figure {
    points: Point[];
}

// XCXX
const FIG1 : Figure = {
    points: [
        {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}
    ]
}

// XCX
//   X
const FIG2 : Figure = {
    points: [
        {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}
    ]
}

// XCX
//  X
const FIG3 : Figure = {
    points: [
        {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}
    ]
}

// XCX
// X
const FIG4 : Figure = {
    points: [
        {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}
    ]
}

// CX
// XX
const FIG5 : Figure = {
    points: [
        {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}
    ]
}

// XC
//  XX
const FIG6 : Figure = {
    points: [
        {x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}
    ]
}

//  CX
// XX
const FIG7 : Figure = {
    points: [
        {x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}
    ]
}

const ROT = [
    [{x: 1, y: 0}, {x: 0, y: 1}],
    [{x: 0, y: 1}, {x: -1, y: 0}],
    [{x: -1, y: 0}, {x: 0, y: -1}],
    [{x: 0, y: -1}, {x: 1, y: 0}]
]

const ALL_FIGS = [
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

function dot(p1: Point, p2: Point) {
    return p1.x * p2.x + p1.y * p2.y
}

function mul(p1: Point, v: number) {
    return {x: p1.x * v, y: p1.y * v}
}

function add(p1: Point, p2: Point) {
    return {x: p1.x + p2.x, y: p1.y + p2.y}
}

function rotate(fig: Figure, rot: number) : Figure {
    let res : Figure = {
        points: fig.points.map(p =>
            add(
                mul(ROT[rot][0], p.x),
                mul(ROT[rot][1], p.y)
            )
        )
    }

    return res;
}

function moveFig(fig: Figure, dp: Point) : Figure {
    let res : Figure = {
        points: fig.points.map(p =>
            add(p, dp)
        )
    }

    return res;
}

function renderFig(fig: Figure, pos: Point, result: JSX.Element[]) {
    fig.points.forEach(p => {
        result.push(renderCell("", add(p, pos)));
    });
    return result;
}

enum GameState {
    RUNNING, END
}

class FieldState {
    constructor(public w: number, public h: number) {
        this.cells = [];
        for (let i = 0; i < w; ++i) {
            this.cells[i] = [];
            for (let j = 0; j < h; ++j)
                this.cells[i][j] = false;
        }

        this.generateNextFig();
        this.setCurFig();
        this.generateNextFig();
    }

    move = (dp: Point) => {
        if (!this.currentFig)
            return true;
        
        let newPos = add(this.figPos, dp);
        let newFig = moveFig(this.currentFig, newPos);

        if (this.isFit(newFig)) {
            this.figPos = newPos;
            return true;
        }

        return false;
    }

    tick = () => {
        if (this.state == GameState.RUNNING) {
            if (!this.move({x: 0, y: 1}))
                this.frizeFig();
        }
    }

    rotate = (rot: number) => {
        if (!this.currentFig)
            return true;
        
        let rotFig = rotate(this.currentFig, rot);
        let newFig = moveFig(rotFig, this.figPos);

        if (this.isFit(newFig)) {
            this.currentFig = rotFig;
            return true;
        }

        return false;
    }

    processKey = (key: string) => {
        if (this.state == GameState.RUNNING) {
            if (key === "ArrowLeft")
                this.move({x: -1, y: 0});
            if (key === "ArrowRight")
                this.move({x: 1, y: 0});
            if (key === " ") {
                if (!this.move({x: 0, y: 1}))
                    this.frizeFig();
            }
            if (key === "ArrowDown")
                this.rotate(1);
            if (key === "ArrowUp")
                this.rotate(3);
        }
    }

    frizeFig = () => {
        let newFig = moveFig(this.currentFig, this.figPos);
        for (let p of newFig.points) {
            this.cells[p.x][p.y] = true;
        }

        let deleteCount = 0;
        for (let y = this.h - 1; y >= 0; ) {
            let deleteRow = true;
            for (let x = 0; x < this.w; x++) {
                if (!this.cells[x][y]) {
                    deleteRow = false;
                    break;
                }
            }

            if (deleteRow) {
                ++deleteCount;
                for (let y2 = y - 1; y2 >= 0; y2--) {
                    for (let x = 0; x < this.w; x++) {
                        this.cells[x][y2 + 1] = this.cells[x][y2];
                    }
                }
                for (let x = 0; x < this.w; x++) {
                    this.cells[x][0] = false;
                }
            } else {
                y--
            }
        }

        if (deleteCount == 1)
            this.score += 50;
        if (deleteCount == 2)
            this.score += 150;
        if (deleteCount == 3)
            this.score += 300;
        if (deleteCount == 4)
            this.score += 500;

        if (this.setCurFig()) {
            this.generateNextFig();
            return;
        }
        
        this.state = GameState.END;
    }

    setCurFig = () => {
        for (let i = 0; i < 3; ++i) {
            this.figPos = {x: this.w / 2, y: i}
            let newFig = moveFig(this.nextFig, this.figPos);
            if (this.isFit(newFig)) {
                this.currentFig = this.nextFig;
                return true;
            }
        }
        false;
    }

    generateNextFig = () => {
        this.nextFig = ALL_FIGS[getRandomInt(0, ALL_FIGS.length)];
    }

    isFit = (fig: Figure) => {
        for (let p of fig.points) {
            if (!this.isPointFit(p))
                return false;
        }

        return true;
    }

    isPointFit = (p: Point) => {
        return p.x >= 0 && p.x < this.w && p.y >= 0 && p.y < this.h &&
            !this.cells[p.x][p.y];
    }

    cells: boolean[][];
    currentFig: Figure;
    nextFig: Figure;
    figPos: Point;
    state: GameState = GameState.RUNNING;
    score = 0;
}

class TetrisField extends React.Component<{field: FieldState}, void>
{
    render() {
        let cells = [];
        
        for (let i = 0; i < this.props.field.w; ++i) {
            for (let j = 0; j < this.props.field.h; ++j) {
                if (this.props.field.cells[i][j])
                    cells.push(renderCell("", {x: i, y: j}));
            }
        }

        if (this.props.field.currentFig) {
            renderFig(this.props.field.currentFig, this.props.field.figPos, cells);
        }
        
        let cells2 = [];
        if (this.props.field.nextFig) {
            renderFig(this.props.field.nextFig, {x : 2, y: 2}, cells2);
        }
        
        let displayW = this.props.field.w + 5;
        return <div>
            <svg width={displayW * CELL_SIZE + 6*BORDER} height={this.props.field.h * CELL_SIZE + 2*BORDER}>
                <rect style={displayStyle} width={displayW * CELL_SIZE + 6*BORDER} height={this.props.field.h * CELL_SIZE + 2*BORDER}/>
                <rect style={fieldStyle} width={this.props.field.w * CELL_SIZE + 2*BORDER} height={this.props.field.h * CELL_SIZE + 2*BORDER}/>
                <g transform={`translate(${(this.props.field.w + 3) * CELL_SIZE}, ${CELL_SIZE})`}>
                    <text y="1em" textAnchor="middle" fontSize={1.5*CELL_SIZE} style={scoreStyle}>Score</text>
                    <text y="2em" textAnchor="middle" fontSize={1.5*CELL_SIZE} style={scoreStyle}>{this.props.field.score}</text>
                </g>
                <g transform={`translate(${BORDER}, ${BORDER})`}>
                    {cells}
                </g>
                <g transform={`translate(${this.props.field.w * CELL_SIZE + 3*BORDER}, ${(this.props.field.h - 5) * CELL_SIZE - BORDER})`}>
                    <rect style={fieldStyle} width={5 * CELL_SIZE + 2*BORDER} height={5 * CELL_SIZE + 2*BORDER}/>
                    <g transform={`translate(${BORDER}, ${BORDER})`}>
                        {cells2}
                    </g>
                </g>
            </svg>
        </div>;
    }
}

export function render() {
    let field = new FieldState(10, 15);

    let render = () => {
        let content = <TetrisField field={field}/>
        ReactDOM.render(content, document.getElementById("container"));
    }

    render();
    
    document.addEventListener('keydown', (event) => {
        field.processKey(event.key);
        render();
    }, false);

    setInterval(() => {
        field.tick();
        render();
        render();
    }, 500);
}
