import MicInput from "./MicInputTest";

export default class {
    constructor(context) {
        this.context = context;
    }

    generate (json, nodes) {
        this.json = json;

        this.buffers = {};

        this.nodes = nodes;


        // jsonが正しく作られているかをチェック
        this.json_tugs = ["name", "node_type", "out"]; // audio_nodesに対してチェックする要素

        this.jsonCheck().then(() => {
            let loadings = [];
            if (this.json.hasOwnProperty("load_files")) {
                for (let file of this.json.load_files) {
                    loadings.push(new Promise((resolve) => {
                        if (file.hasOwnProperty("path")) {
                            this.loadFile(file.path).then((response) => {
                                this.context.decodeAudioData(response).then((buffer) => {
                                    this.buffers[file.buffer_name] = buffer;
                                    resolve();
                                }, () => {
                                    console.error("decode error");
                                });
                            });
                        }
                    }));
                }
            }

            if (this.json.hasOwnProperty("listener")) {
                let listener = this.context.listener;

                let lp = this.json["listener"];

                if (lp.hasOwnProperty("position")) {
                    listener.setPosition(lp.position[0], lp.position[1], lp.position[2]);
                }


                if (lp.hasOwnProperty("up") || lp.hasOwnProperty("forward")) {
                    let u = lp.up || [listener.upX.value, listener.upY.value, listener.upZ.value];
                    let f = lp.forward || [listener.forwardX.value, listener.forwardY.value, listener.forwardZ.value];
                    listener.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
                }
            }

            for (let an of this.json.audio_nodes) {
                this.createNode(an);
            }

            Promise.all(loadings).then(() => {
                for (let an of this.json.audio_nodes) {
                    if (an.node_type === "buffer_source") this.createBufferSources(an);
                }
                this.connectAudioNodes();
            });
        });
    }

    // jsonのデータチェック用関数
    jsonCheck() {
        return new Promise((resolve) => {
            if (!this.json.hasOwnProperty("audio_nodes")) console.error('json does not have audio_nodes.');
            for (let n of this.json.audio_nodes) {
                for (let i = 0; i < this.json_tugs.length; i++) {
                    if (!n.hasOwnProperty(this.json_tugs[i])) console.error('json does not have ' + this.json_tugs[i].toString());
                }
            }
            resolve();
        });
    }

    loadFile(path) {
        return fetch(path).then((response) => {
            return response.arrayBuffer();
        });
    }

    createBufferSources(audio_node) {
        let buffer_source = this.context.createBufferSource();
        this.setParams(buffer_source, audio_node.params);
        if (this.buffers[audio_node.params.buffer]) {
            buffer_source.buffer = this.buffers[audio_node.params.buffer];
        } else {
            console.error('buffer "' + audio_node.params.buffer + '" not found.');
        }
        this.nodes[audio_node.name] = buffer_source;
    }

    createNode(audio_node) {
        let node;
        switch (audio_node.node_type) {
            case "oscillator":
                node = this.context.createOscillator();
                break;

            case "gain":
                node = this.context.createGain();
                break;
            case "panner":
                node = this.context.createPanner();
                break;
            case "input":
                node = new MicInput(this.context);
        }

        if (audio_node.node_type !== "buffer_source") {
            this.setParams(node, audio_node.params);
            this.nodes[audio_node.name] = node;
        }
    }

    setParams(target, params) {
        for (let p in params) {
            if (!params.hasOwnProperty(p)) continue;
            switch (p) {
                case "buffer":
                    break;

                case "position":
                    target.setPosition(params[p][0], params[p][1], params[p][2]);
                    break;

                case "orientation":
                    target.setOrientation(params[p][0], params[p][1], params[p][2]);
                    break;

                case "frequency":
                case "gain":
                    target[p].value = params[p];
                    break;

                default:
                    target[p] = params[p];
                    break;
            }
        }
    }

    connectAudioNodes() {
        for (let an of this.json.audio_nodes) {
            if (an.hasOwnProperty("out")) {
                if (an.out === "destination") {
                    this.nodes[an.name].connect(this.context.destination);
                } else {
                    try {
                        this.nodes[an.name].connect(this.nodes[an.out]);
                    } catch (e) {
                        console.log(this.nodes[an.out][an.out_sub]);
                        this.nodes[an.name].connect(this.nodes[an.out][an.out_sub]);
                    }
                }
            } else {
                console.error("audio nodes does not have out");
            }
        }
    }

    get getNodes() {
        return this.nodes;
    }

    set listener_position(a) {
        this.context.listener.setPosition(a[0], a[1], a[2]);
    }
}