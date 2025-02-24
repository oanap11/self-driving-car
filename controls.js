class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
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