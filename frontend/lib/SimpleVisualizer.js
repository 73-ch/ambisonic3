export default class {
    constructor() {
        this.canvas_obj = document.createElement("canvas");

        document.body.appendChild(this.canvas_obj);


        this.context = this.canvas_obj.getContext("2d");


        this.color = [255, 255, 255, 255];

        this.background_color = [0, 0, 0];

        this.resizeCanvas();

        //this.context.fillStyle = "rgb(0,0,0)";
        // this.context.fillRect(0,0,this.canvas_obj.width, this.canvas_obj.height);
        // this.drawScreenFillRect();

        this.draw();


        document.addEventListener('fullscreenchange', (e) =>  {
            this.resizeCanvas();
        });

        document.addEventListener('webkitfullscreenchange', (e) =>  {
            this.resizeCanvas();
        });
        document.addEventListener('mozfullscreenchange', (e) =>  {
            this.resizeCanvas();
        });

    }

    resizeCanvas() {
        this.canvas_obj.width = window.innerWidth;
        this.canvas_obj.height = window.innerHeight;

        // 本当ならfullscreenのエレメント取ってきて、フルスクリーン状態とそうでない場合で、canvasサイズを更新するべき(未実装)

        // if (document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement) {
        //     console.log("fullscreen");
        //     this.canvas_obj.width = window.parent.screen.width;
        //     this.canvas_obj.height = window.parent.screen.height;
        // } else {
        //     this.canvas_obj.width = window.innerWidth;
        //     this.canvas_obj.height = window.innerHeight;
        // }

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

    draw() {
        this.context.beginPath();
        this.context.fillStyle = `rgba(${this.color})`;
        this.context.fillRect(0,0,this.canvas_obj.width, this.canvas_obj.height);

        requestAnimationFrame(()=>{this.draw()});
    }
}