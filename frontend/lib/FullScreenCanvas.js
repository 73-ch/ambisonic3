import platform from 'platform';

export default class {
    constructor() {
        this.canvas_obj = document.createElement("canvas");

        document.body.appendChild(this.canvas_obj);

        document.addEventListener('fullscreenchange', (e) => {
            this.resizeCanvas();
        });

        document.addEventListener('webkitfullscreenchange', (e) => {
            this.resizeCanvas();
        });

        document.addEventListener('mozfullscreenchange', (e) => {
            this.resizeCanvas();
        });

        this.canvas_obj.addEventListener('touchmove', canceltouch, false);

        function canceltouch(e) {
            e.preventDefault();
        }
    }

    resizeCanvas() {
        if (platform.name === 'Safari' || platform.os.family === 'iOS') {
            this.canvas_obj.width = window.parent.screen.width;
            this.canvas_obj.height = window.parent.screen.height;
        } else {
            this.canvas_obj.width = window.innerWidth;
            this.canvas_obj.height = window.innerHeight;
        }
    }

    toggleFullscreen() {
        if (this.canvas_obj["requestFullscreen"]) {
            console.log("fullscreen");
            this.canvas_obj.requestFullscreen();
        } else if (this.canvas_obj["webkitRequestFullScreen"]) {
            console.log("fullscreen webkit");
            this.canvas_obj.webkitRequestFullScreen();
        } else if (this.canvas_obj["mozRequestFullScreen"]) {
            console.log("fullscreen moz");
            this.canvas_obj.mozRequestFullScreen();
        }

        this.resizeCanvas();
    }
}