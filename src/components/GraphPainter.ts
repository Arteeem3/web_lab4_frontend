export default class GraphPainter {
    SIZE = 300;
    LINE_WIDTH = 1.5;
    TEXT_MARGIN = 15;
    TEXT_LINE_HEIGHT = 3;
    COLOR_RED = "#b50300"
    COLOR_GREEN = "#66FF66"
    COLOR_MAIN = "#9999CC"
    WIDTH_IN_POINTS = 12;

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    r: number | undefined

    constructor(canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                r: number | undefined
                ) {
        this.canvas = canvas;
        this.ctx = context;
        this.r = r;
    }

    redrawAll(r: number){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGraph(r);
        this.drawAxes();
        this.setPointerAtDot(3);
        this.setPointerAtDot(1);
        this.setPointerAtDot(-1)
        this.setPointerAtDot(2)
        this.setPointerAtDot(-2)
        this.setPointerAtDot(5)
        this.setPointerAtDot(-5)
    }

    drawAxes() {
        this.ctx.fillStyle = "#666666";
        this.drawArrow(-this.SIZE, this.SIZE / 2, this.SIZE, this.SIZE / 2);
        this.drawArrow( this.SIZE / 2, this.SIZE, this.SIZE / 2, 0);
    }

    drawGraph(r: number) {
        const pointInPixels = this.SIZE / this.WIDTH_IN_POINTS;
        this.ctx.fillStyle = this.COLOR_MAIN;

        // Прямоугольник в правой нижней четверти (ширина r/2, высота r)
        this.ctx.fillRect(
            this.SIZE / 2,                                 // X: начинается от центра
            this.SIZE / 2,                                 // Y: начинается от центра
            (r / 2) * pointInPixels,                      // Ширина: r/2
            r * pointInPixels                              // Высота: r
        );

        // Треугольник в правой верхней четверти (высота r, ширина r/2)
        this.ctx.beginPath();
        this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);     // Начало в центре
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels); // Вверх на r
        this.ctx.lineTo(this.SIZE / 2 + (r / 2) * pointInPixels, this.SIZE / 2); // Вправо на r/2
        this.ctx.closePath();
        this.ctx.fill();

        // Четверть круга (без изменений)
        this.ctx.beginPath();
        this.ctx.arc(
            this.SIZE / 2,
            this.SIZE / 2,
            r / 2 * pointInPixels,
            Math.PI,
            3 / 2 * Math.PI
        );
        this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r / 2 * pointInPixels);
        this.ctx.lineTo(this.SIZE / 2 - r / 2 * pointInPixels, this.SIZE / 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    setPointerAtDot(max_r = 5) {
        const pointInPixels = this.SIZE / this.WIDTH_IN_POINTS;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(`${max_r}`, this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 - this.TEXT_MARGIN);
        this.ctx.fillText(`${max_r}`, this.SIZE / 2 + this.TEXT_MARGIN, this.SIZE / 2 - pointInPixels * max_r);

        this.ctx.beginPath()
        this.ctx.lineWidth = this.LINE_WIDTH;
        this.ctx.moveTo(this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 + this.TEXT_LINE_HEIGHT);
        this.ctx.lineTo(this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 - this.TEXT_LINE_HEIGHT);
        this.ctx.moveTo(this.SIZE / 2 + this.TEXT_LINE_HEIGHT, this.SIZE / 2 - pointInPixels * max_r);
        this.ctx.lineTo(this.SIZE / 2 - this.TEXT_LINE_HEIGHT, this.SIZE / 2 - pointInPixels * max_r);
        this.ctx.stroke();
    }

    drawArrow(fromx, fromy, tox, toy) {
        let headlen = 10; // length of head in pixels
        let dx = tox - fromx;
        let dy = toy - fromy;
        let angle = Math.atan2(dy, dx);
        this.ctx.strokeStyle = "#666666";
        this.ctx.beginPath();
        this.ctx.lineWidth = this.LINE_WIDTH;
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    drawPoint(x: number, y: number, success = true) {
        const totalPoints = 12;
        this.ctx.fillStyle = success
            ? this.COLOR_GREEN
            : this.COLOR_RED;
        const pointInPixels = this.SIZE / totalPoints;
        this.ctx.beginPath();
        this.ctx.arc(
            this.SIZE / 2 + pointInPixels * x,
            this.SIZE / 2 - y * pointInPixels,
            2,
            0,
            Math.PI * 2,
        );
        this.ctx.fill();
    }
}