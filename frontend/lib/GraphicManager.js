import * as THREE from 'three'
import FullScreenCanvas from "./FullScreenCanvas"
import BaseScene from "./BaseScene"

const GraphicManager = class extends FullScreenCanvas {
    constructor() {
        super();

        this.renderer = new THREE.WebGLRenderer({"canvas": this.canvas_obj});
        this.renderer.setClearColor(0x000000, 1.0);

        this._scene = null;

        window.addEventListener('resize', (e) => {
            this.resize();
        });

        this.draw();
    }

    resize() {
        console.log("resize");
        super.resizeCanvas();
        this.renderer.setSize(this.canvas_obj.width, this.canvas_obj.height);
        if (this._scene) this._scene.resize();
    }

    set scene(_scene) {
        if (!(_scene instanceof BaseScene)) {
            console.error("given scene does not inherit BaseScene.");
            return;
        }

        this._scene = _scene;
    }

    get scene() {
        return this._scene;
    }

    draw() {
        if (this._scene) {
            this._scene.update();
            this.renderer.render(this._scene.scene, this._scene.cam);
            this._scene.rendered();
        }

        requestAnimationFrame(() => {
            this.draw();
        });
    }
};
export default GraphicManager