class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        Object.assign(this, { x, y, width, height, speed: 0, angle: 0 });
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        if(controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#moveCar();
            this.polygon = this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }   

        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
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

    draw(ctx, color, drawSensor = false) {
        ctx.fillStyle = this.damaged ? "gray" : color;

        ctx.beginPath();
        this.polygon.forEach((point, index) => {
            index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
        });
        ctx.fill();

        if(this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }
}