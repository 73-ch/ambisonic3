import MicInput from "./MicInputTest";
import StuckAudioBuffers from "./StuckAudioBuffers";
import platform from 'platform';

export default class {
    constructor(context) {
        this.context = context;
        this.stuck_buffer = new StuckAudioBuffers(context);
    }

    async generate(json, nodes) {
        this.json = json;

        this.nodes = nodes; // node_poolとかの方がいいかも

        // jsonが正しく作られているかをチェック
        this.json_tugs = ["name", "node_type", "out"]; // audio_nodesに対してチェックする要素

        await this.jsonCheck();

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

        for (let node_param of this.json.audio_nodes) {
            this.createNode(node_param);
        }


        if (this.json.load_files) {
            const load_files = this.json.load_files;

            await this.stuck_buffer.loadFiles(load_files);
        }


        for (let an of this.json.audio_nodes) {
            if (an.node_type === "buffer_source") this.createBufferSource(an);
            this.connectAudioNode(an);
        }
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

    createBufferSource(audio_node) {
        let buffer_source = this.context.createBufferSource();
        buffer_source.buffer = this.stuck_buffer.loaded_buffers[audio_node.params.buffer];

        this.setParams(buffer_source, audio_node.params);

        this.nodes[audio_node.name] = buffer_source;

        return buffer_source;
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
                break;

            case "filter":
                node = this.context.createBiquadFilter();
                break
        }

        if (audio_node.node_type !== "buffer_source") {
            this.setParams(node, audio_node.params);
            this.nodes[audio_node.name] = node;
        }

        return node;
    }

    setParams(target, params) {
        for (let p in params) {
            if (!params.hasOwnProperty(p)) continue;
            if (target[p] instanceof AudioParam) {
                target[p].value = params[p];
            } else if (p === "buffer") {

            } else if (p === "position") {
                target.setPosition(params[p][0], params[p][1], params[p][2]);
            } else if (p === "orientation") {
                target.setOrientation(params[p][0], params[p][1], params[p][2]);
            } else {
                target[p] = params[p];
            }
        }
    }

    connectAudioNode(node_params) {
        if (node_params.hasOwnProperty("out")) {
            let out_node;

            if (node_params.out === "destination") {
                out_node = this.context.destination;
            } else if ("out_sub" in node_params) {
                out_node = this.nodes[node_params.out][node_params.out_sub];
            } else {
                out_node = this.nodes[node_params.out];
            }

            this.nodes[node_params.name].connect(out_node);
        } else {
            console.error("audio nodes does not have out");
        }

    }

    get getNodes() {
        return this.nodes;
    }

    set listener_position(a) {
        this.context.listener.setPosition(a[0], a[1], a[2]);
    }
}