const carCanvas = document.getElementById("car-canvas");
const networkCanvas = document.getElementById("network-canvas");

carCanvas.width = 200;
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateCars(1);
let bestCar = cars[0];

// Load best brain from localStorage
const savedBrain = localStorage.getItem("bestBrain");
if (savedBrain) {
    const bestBrain = JSON.parse(savedBrain);
    cars.forEach((car, i) => {
        car.brain = bestBrain;
        if (i !== 0) NeuralNetwork.mutate(car.brain, 0.1);
    });
}

const traffic = [
    [1, -100], [0, -300], [2, -300], [0, -500], 
    [1, -500], [1, -700], [2, -700]
].map(([lane, y]) => new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", 2));

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(count) {
    return Array.from({ length: count }, () => new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
}

function updateCars() {
    traffic.forEach(car => car.update(road.borders, []));
    cars.forEach(car => car.update(road.borders, traffic));
    bestCar = cars.reduce((best, c) => (c.y < best.y ? c : best), bestCar);
}

function drawCars() {
    road.draw(carContext);
    traffic.forEach(car => car.draw(carContext, "red"));

    carContext.globalAlpha = 0.2;
    cars.forEach(car => car.draw(carContext, "blue"));
    carContext.globalAlpha = 1;

    bestCar.draw(carContext, "blue", true);
}

function animate() {
    updateCars();

    carCanvas.height = networkCanvas.height = window.innerHeight;
    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

    drawCars();

    carContext.restore();
    Visualizer.drawNetwork(networkContext, bestCar.brain);

    requestAnimationFrame(animate);
}

animate();
