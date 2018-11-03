import * as THREE from 'three'
import BaseScene from "../../lib/BaseScene"
import vertex from './shader/default_vert.vert'
import init_frag from './shader/init_frag.glsl'
import update_frag from './shader/fragment.frag'
import render_frag from './shader/render_frag.glsl'

const LifeGame = class extends BaseScene {
    constructor(_position = [0,0,0], _renderer) {
        super();
        this.size = {x: 100, y: 100};

        this.position = _position;
        this.size_per_device = {x:50, y:50};

        this.age = 0;

        this.count = 0;

        this.renderer = _renderer;

        this.pixels = new Uint8Array(this.size_per_device.x * this.size_per_device.y * 4);

        this.initWholeMap();
        this.setDefaultWholeMap();

        this.initUpdateScene();


        // debug
        // this.initRenderScene();
        // setTimeout(()=> {
        //     setInterval(() => {
        //         this.incrementAge();
        //     }, 100)
        // }, 3000);
        //
        //
        // setTimeout(()=> {
        //     setInterval(() => {
        //         this.swapBuffer();
        //     }, 100)
        // }, 3100);
    }

    initWholeMap() {
        // lifegame全体の更新を行うターゲット
        this.front_buffer = new THREE.WebGLRenderTarget(this.size.x, this.size.y, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
        });

        this.back_buffer = new THREE.WebGLRenderTarget(this.size.x, this.size.y, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
        });
    }

    setDefaultWholeMap() {
        // 一番最初のlifegameのマップへの書き込み
        let init_scene = new THREE.Scene();

        this.whole_cam = new THREE.OrthographicCamera(this.size.x / -2.,this.size.x / 2., this.size.y / 2., this.size.y / -2., 0, 100);
        init_scene.add(this.whole_cam);

        // lifegame全体のマテリアルと
        this.whole_map_geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, 1, 1);

        const shader_material_params = {
            uniforms: {
                "u_resolution": {
                    type: "vec2",
                    value: this.size
                },
                "seed": {
                    type: 'f',
                    value: Math.random()
                }
            },
            vertexShader: vertex,
            fragmentShader: init_frag,
            side: THREE.DoubleSide,
            transparent: true
        };

        const init_map_material = new THREE.ShaderMaterial(shader_material_params);

        const init_plane = new THREE.Mesh(this.whole_map_geometry, init_map_material);

        init_scene.add(init_plane);

        this.renderer.render(init_scene, this.whole_cam, this.back_buffer);

        // debug
        // this.scene = init_plane;
        // this.cam = this.whole_cam;
    }

    initUpdateScene() {
        this.whole_scene = new THREE.Scene();

        this.whole_scene.add(this.whole_cam);


        const shader_material_params = {
            uniforms: {
                "texture": {
                    type: 't',
                    value: this.back_buffer.texture
                },
                "time": {
                    type: 'f',
                    value: performance.now()
                },
                "u_resolution": {
                    type: "vec2",
                    value: this.size
                }
            },
            vertexShader: vertex,
            fragmentShader: update_frag,
            side: THREE.DoubleSide,
            transparent: true
        };

        this.update_map_material = new THREE.ShaderMaterial(shader_material_params);
        this.whole_plane = new THREE.Mesh(this.whole_map_geometry, this.update_map_material);

        this.whole_scene.add(this.whole_plane);

        // debug
        // this.scene = this.whole_scene;
        // this.cam = this.whole_cam;
    }

    initRenderScene() {
        // lifegameからポジションに応じて画面描画を行うシーン
        this.scene = new THREE.Scene();

        const width = this.size_per_device.x, height = this.size_per_device.y;

        this.cam = new THREE.OrthographicCamera(width / -2., width / 2., height / -2., height / 2., 0, 100);
        this.scene.add(this.cam);

        this.display_geometry = new THREE.PlaneGeometry(width, height, 1, 1);

        //
        for (let tri of this.display_geometry.faceVertexUvs[0]) {
            console.log(tri);
            for (let v of tri) {
                console.log(v);
                v.x = (v.x + this.position[0]) * this.size_per_device.x / this.size.x;
                v.y = (v.y + this.position[1]) * this.size_per_device.y / this.size.y;
                console.log(v);
            }
        }

        const shader_material_params = {
            uniforms: {
                "texture": {
                    type: 't',
                    value: this.front_buffer.texture
                }
            },
            vertexShader: vertex,
            fragmentShader: render_frag,
            side: THREE.DoubleSide,
            transparent: true
        };

        this.display_material = new THREE.ShaderMaterial(shader_material_params);

        this.display_plane = new THREE.Mesh(this.display_geometry, this.display_material);

        this.scene.add(this.display_plane);
    }

    incrementAge() {
        this.age++;
        this.whole_plane.material.uniforms.time.value = performance.now();

        this.whole_plane.material.uniforms.texture.value = this.back_buffer.texture;

        this.renderer.render(this.whole_scene, this.whole_cam, this.front_buffer);

        this.display_plane.material.uniforms.texture.value = this.front_buffer.texture;

        // 表示されているピクセルの数を保持
        // let pixels = new Uint8Array(this.size_per_device.x * this.size_per_device.y * 4);
        const gl = this.renderer.getContext();
        gl.readPixels(this.position[0], this.position[1], this.size_per_device.x, this.size_per_device.y, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);
        console.log(this.pixels);
        this.countRendered();

        // this.swapBuffer();
    }

    swapBuffer() {
        const temp_buffer = this.back_buffer;
        this.back_buffer = this.front_buffer;
        this.front_buffer = temp_buffer;
    }

    countRendered(pixels) {
        pixels.reduce((b,a) => b + a);
    }

    reset() {
        this.age = 0;

        const width = window.innerWidth, height = window.innerHeight;
        this.cam.left = width / -2.;
        this.cam.right = width / 2.;
        this.cam.top = height / -2.;
        this.cam.bottom = height / 2.;

    }


    judgeCell(age, tars) {
        let count = 0;

        for (let i = 0, len_i = tars.length; i < len_i; i++) {
            for (let j = 0, len_j = tars[0].length; j < len_j; j++) {
                count = XYUtils.countAround([i, j], tars);

            }
        }

    }

};

export default LifeGame;