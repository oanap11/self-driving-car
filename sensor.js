class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = []; // if there is a border nearby, how far is it?
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = this.rays.map(ray => this.#getReading(ray, roadBorders));
    }
    
    #getReading(ray, roadBorders) {
        const touches = roadBorders
            .map(border => getIntersection(ray[0], ray[1], border[0], border[1]))
            .filter(Boolean);
    
        if (touches.length === 0) return null;
    
        return touches.reduce((closest, touch) => 
            touch.offset < closest.offset ? touch : closest
        );
    }
    

    #castRays() {
        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;  

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            const start = this.rays[i][0];
            const originalEnd = this.rays[i][1];
            const end = this.readings[i] || originalEnd;

            this.#drawLine(ctx, start, end, "yellow");
            this.#drawLine(ctx, originalEnd, end, "black");
        }
    }

    #drawLine(ctx, start, end, color) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
}
