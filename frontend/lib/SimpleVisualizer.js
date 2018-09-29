import * as THREE from 'three';

export default class {
    constructor() {
        this.canvas_obj = document.createElement("canvas");

        document.body.appendChild(this.canvas_obj);

        this.resizeCanvas();

        this.createThreeComponents();

        this.color = [0, 0, 0, 255];

        this.background_color = [0, 0, 0];

        this.draw();


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

    resizeCanvas() {
        setTimeout(() => {
            if (document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement) {
                console.log("fullscreen");
                this.canvas_obj.width = window.parent.screen.width;
                this.canvas_obj.height = window.parent.screen.height;
            } else {
                this.canvas_obj.width = window.innerWidth;
                this.canvas_obj.height = window.innerHeight;
            }

            this.renderer.setSize(this.canvas_obj.width, this.canvas_obj.height);
        }, 100);

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
        this.m_plane.color.setRGB(this.color[0],this.color[1],this.color[2]);
        
        this.renderer.render(this.scene, this.cam);
        
        requestAnimationFrame(() => {
            this.draw();
        });
    }

}