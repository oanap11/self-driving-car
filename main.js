const carCanvas = document.getElementById('car-canvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('network-canvas');
networkCanvas.width = 300;

const carContext = carCanvas.getContext('2d');
const networkContext = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function animate() {
    traffic.forEach(car => car.update(road.borders, []));

    car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carContext);
    traffic.forEach(car => car.draw(carContext, "red"));

    car.draw(carContext, "blue");
    carContext.restore();

    Visualizer.drawNetwork(networkContext, car.brain);
    requestAnimationFrame(animate);
}