export default class {
    constructor() {
        this.canvas_obj = document.createElement("canvas");

        document.body.appendChild(this.canvas_obj);


        this.context = this.canvas_obj.getContext("2d");


        this.color = [255, 255, 255, 255];

        this.background_color = [0, 0, 0];

        this.initCanvas();

        //this.context.fillStyle = "rgb(0,0,0)";
        // this.context.fillRect(0,0,this.canvas_obj.width, this.canvas_obj.height);
        // this.drawScreenFillRect();

        this.draw();

    }

    initCanvas() {
        this.canvas_obj.width = window.innerWidth;
        this.canvas_obj.height = window.innerHeight;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = `rgba(${this.color})`;
        this.context.fillRect(0,0,this.canvas_obj.width, this.canvas_obj.height);

        requestAnimationFrame(()=>{this.draw()});
    }
}