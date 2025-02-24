const canvas = document.getElementById('main-canvas');
canvas.width = 200;

const context = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function animate() {
    traffic.forEach(car => car.update(road.borders, []));

    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;

    context.save();
    context.translate(0, -car.y + canvas.height * 0.7);

    road.draw(context);
    traffic.forEach(car => car.draw(context, "red"));

    car.draw(context, "blue");

    context.restore();
    requestAnimationFrame(animate);
}