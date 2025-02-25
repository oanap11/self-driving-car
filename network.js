class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(inputs, network) {
        let outputs = inputs;
        for (let level of network.levels) {
            outputs = Level.feedForward(outputs, level);
        }
        return outputs;
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            level.biases = level.biases.map(b => lerp(b, Math.random() * 2 - 1, amount));
            level.weights = level.weights.map(row => row.map(w => lerp(w, Math.random() * 2 - 1, amount)));
        });
    }     
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount).fill(0).map(() => Math.random() * 2 - 1);
        this.weights = Array.from({ length: inputCount }, () => new Array(outputCount).fill(0).map(() => Math.random() * 2 - 1));
    }

    static feedForward(inputs, level) {
        level.inputs = inputs;
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = level.inputs.reduce((acc, input, j) => acc + input * level.weights[j][i], 0);
            level.outputs[i] = sum > level.biases[i] ? 1 : 0;
        }
        return level.outputs;
    }
}
