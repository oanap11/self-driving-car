class Car {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height, speed: 0, angle: 0 });
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders) {
        this.#moveCar();
        this.sensor.update(roadBorders);
    }

    #moveCar() {
        const { forward, reverse, left, right } = this.controls;
        
        if (forward) this.speed += this.acceleration;
        if (reverse) this.speed -= this.acceleration;
        
        this.speed = Math.max(-this.maxSpeed / 2, Math.min(this.speed, this.maxSpeed));
        this.speed = Math.abs(this.speed) < this.friction ? 0 : this.speed - Math.sign(this.speed) * this.friction;
        
        if (this.speed !== 0) {
            const flip = Math.sign(this.speed);
            if (left) this.angle += 0.03 * flip;
            if (right) this.angle -= 0.03 * flip;
        }
        
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();

        this.sensor.draw(ctx);
    }
}