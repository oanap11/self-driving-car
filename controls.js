class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        if (type === "DUMMY") {
            this.forward = true;
        }
    }
}