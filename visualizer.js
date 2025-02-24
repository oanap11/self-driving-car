class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50, left = margin, top = margin;
        const width = ctx.canvas.width - margin * 2, height = ctx.canvas.height - margin * 2;
        const levelHeight = height / network.levels.length;

        network.levels.forEach((level, i) => {
            const levelTop = top + lerp(
                height - levelHeight, 0, 
                network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
            );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, level, left, levelTop, width, levelHeight, 
                i === network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : []
            );
        });
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const { inputs, outputs, weights, biases } = level;
        const right = left + width, bottom = top + height;
        const nodeRadius = 18;

        inputs.forEach((input, i) => {
            outputs.forEach((output, j) => {
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            });

            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(input);
            ctx.fill();
        });

        outputs.forEach((output, i) => {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(output);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = `${nodeRadius * 1.5}px Arial`;
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        });
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(left, right, nodes.length === 1 ? 0.5 : index / (nodes.length - 1));
    }
}
