class Controls {
    constructor() {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        const keyMap = {
            ArrowUp: 'forward',
            ArrowLeft: 'left',
            ArrowRight: 'right',
            ArrowDown: 'reverse'
        };
    
        const updateKeyState = (event, state) => {
            if (keyMap.hasOwnProperty(event.key)) {
                this[keyMap[event.key]] = state;
            }
        };
    
        document.onkeydown = (event) => updateKeyState(event, true);
        document.onkeyup = (event) => updateKeyState(event, false);
    }
}