import * as THREE from 'three';
import FullScreenCanvas from "./FullScreenCanvas"

export default class extends FullScreenCanvas {
    constructor() {
        super();
        this.createThreeComponents();

        this.resizeCanvas();

        this.colors = [];

        this.background_color = [0, 0, 0];

        this.draw();

    }

    createThreeComponents() {
        this.renderer = new THREE.WebGLRenderer({"canvas": this.canvas_obj});
        this.renderer.setClearColor(0x000000, 1.0);

        this.scene = new THREE.Scene();

        this.cam = new THREE.OrthographicCamera(window.innerWidth / -2., window.innerWidth / 2., window.innerHeight / 2., window.innerHeight / -2., 0, 100);
        // this.cam.position.z = 100;
        this.scene.add(this.cam);

        this.g_plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1, 1);
        this.m_plane = new THREE.MeshBasicMaterial({color: 0x000000});
        this.m_plane.needsUpdate = true;
        this.plane = new THREE.Mesh(this.g_plane, this.m_plane);

        this.plane.material.needsUpdate = true;

        this.scene.add(this.plane);
    }

    addColor(colors, sub) {
        this.colors.push({color: colors, sub: sub});
    }

    clearColor() {
        this.colors = [];
    }

    resizeCanvas() {
        super.resizeCanvas();
        this.renderer.setSize(this.canvas_obj.width, this.canvas_obj.height);
    }

    updateColors(colors) {
        let ret_color = [0., 0., 0., 1.];

        for (let i = 0; i < colors.length; i++) {
            let c = colors[i];
            if (!c.color || !c.sub) {
                console.error("color is wrong");
                continue;
            }

            for (let ci = 0; ci < 3; ci++) {
                ret_color[ci] += c.color[ci] * c.color[3];
                c.color[ci] = Math.min(1.0, Math.max(0.0, c.color[ci] - c.sub[ci]));
            }

            if (Math.max(c.color[0], c.color[1], c.color[2]) === 0.0) colors.splice(i, 1);
        }
        return ret_color;
    }

    draw() {
        const color = this.updateColors(this.colors);

        this.m_plane.color.setRGB(color[0], color[1], color[2]);

        this.renderer.render(this.scene, this.cam);

        requestAnimationFrame(() => {
            this.draw();
        });
    }

}