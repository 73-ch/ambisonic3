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
        this.size_per_device = {x:10, y:10};

        this.age = 0;

        this.count = 0;

        this.renderer = _renderer;

        this.initWholeMap();
        this.setDefaultWholeMap();

        this.initUpdateScene();

        this.initRenderScene();
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
        // this.display_geometry.uvsNeedUpdate = true;
        //
        // let uvs = new Uint32Array(8);
        //
        // for (let i = 0; i < 4; i++) {
        //     uvs[i*2] = this.size_per_device[0] * this.position[0];
        //     uvs[i*2+1] = this.size_per_device[1] * this.position[1];
        // }

        // console.log(this.display_geometry.attributes);

        // this.display_geometry.faceVertexUvs[0][0] = uvs;

        // console.log(this.display_geometry.attributes.uvs);
        // this.display_geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ));

        // this.display_material = new THREE.MeshBasicMaterial({
        //     map: this.back_buffer.texture,
        //     wireframe: false
        // });

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

    update() {
        this.count++;

        // if (this.count % 10 !== 0) return;

        this.age++;
        this.whole_plane.material.uniforms.time.value = performance.now();

        this.whole_plane.material.uniforms.texture.value = this.back_buffer.texture;

        this.renderer.render(this.whole_scene, this.whole_cam, this.front_buffer);

        this.display_plane.material.uniforms.texture.value = this.front_buffer.texture;

        this.swapbuffer();
    }

    swapbuffer() {
        const temp_buffer = this.back_buffer;
        this.back_buffer = this.front_buffer;
        this.front_buffer = temp_buffer;
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