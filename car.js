class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        Object.assign(this, { x, y, width, height, speed: 0, angle: 0 });
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.damaged = false;

        if(controlType == "KEYS") {
            this.sensor = new Sensor(this);
        }
        
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#moveCar();
            this.polygon = this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }   

        this.sensor?.update(roadBorders, traffic);
    }

    #assessDamage(roadBorders, traffic) {
        const hitBorder = roadBorders.some(border => polysIntersect(this.polygon, border));
        const hitTraffic = traffic.some(car => polysIntersect(this.polygon, car.polygon));

        return hitBorder || hitTraffic;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        const angles = [this.angle - alpha, 
                        this.angle + alpha, 
                        Math.PI + this.angle - alpha, 
                        Math.PI + this.angle + alpha];
    
        for (const angle of angles) {
            points.push({
                x: this.x - Math.sin(angle) * rad,
                y: this.y - Math.cos(angle) * rad 
            });
        }
    
        return points;
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

    draw(ctx, color) {
        ctx.fillStyle = this.damaged ? "gray" : color;

        ctx.beginPath();
        this.polygon.forEach((point, index) => {
            index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
        });
        ctx.fill();

        this.sensor?.draw(ctx);
    }
}