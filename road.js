class Road {
    constructor(x, width, laneCount = 3) {
        Object.assign(this, { x, width, laneCount });
        
        this.left = x - width / 2;
        this.right = x + width / 2;
        
        const infinity = 1e6;
        this.top = -infinity;
        this.bottom = infinity;

        this.borders = [
            [{ x: this.left, y: this.top }, { x: this.left, y: this.bottom }],
            [{ x: this.right, y: this.top }, { x: this.right, y: this.bottom }]
        ];
    }

    getLaneCenter(laneIndex) {
        return this.left + (this.width / this.laneCount) * (laneIndex + 0.5);
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i < this.laneCount; i++) {
            const x = this.left + (this.width * i) / this.laneCount;
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(([start, end]) => {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        });
    }
}
