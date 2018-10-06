// libraries
import SimplexNoise from 'simplex-noise'
import platform from 'platform'
import QueryString from 'query-string'

import DeviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
import NoisePlayer from "../../lib/NoisePlayer";
import SimpleVisualizer from "../../lib/SimpleVisualizer";
import PositionManager from "../../lib/PositionManager"
import {playAudioFile, getAudioTime} from "../../lib/LiveCodingUtilities";
import "./home.scss"

const createUniqueHash = () => {
    return (Math.floor((Math.random() + 5.) ** 20.)).toString(16);
};

export default class {
    constructor() {
        this.button = document.querySelector("#start");

        this.query = QueryString.parse(location.search);

        this.debug = !!this.query.debug;

        // show device info
        if (this.debug) {
            console.log(`debug_mode`);
        }
        console.log(this.query);
        console.log(platform);

        // active audio context
        this.button.addEventListener('click', (e) => {
            this.init();
        });

        // other setup
        this.messenger = new DeviseMessenger(this.messageReceived, this);

        setTimeout(() => {
            this.messenger.testConnection();
            this.messenger.getUserParams();
        }, 300);

        // position
        this.position_manager = new PositionManager();
        this.position_manager.getPositionFromQuery();
    }

    init() {
        // hide start button
        this.button.style.display = 'none';
        document.querySelector('#button-wrapper').style.display = 'none';

        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.context = new AudioContext();
        this.context.createBufferSource().start(0);
        this.nodes = {};
        this.generator = new AudioNodeGenerator(this.context);

        this.time_sync = new TimeSync(this.context, true, this.messenger, this.debug);

        this.noise_player = new NoisePlayer(this.context);

        // live coding用のintervalの格納
        this.intervals = {};

        // visualizer
        this.visualizer = new SimpleVisualizer();
        if (!this.debug) this.visualizer.toggleFullscreen();

        console.log("start");
    }

    messageReceived(data) {
        if (this.time_sync) {
            this.time_sync.messageReceived(data);
        }
        // console.log(data);
        switch (data.action) {
            case "audio_nodes":
                this.json = JSON.parse(data.json);

                this.generator.generate(this.json, this.nodes);

                if (this.debug) this.outputAudioNodesCreateInfo(data);

                break;

            case "audio_params":
                console.log(data);

                eval(data.text);

                break;
            default:
                // console.log("data received", data);
                break;
        }
    }

    outputAudioNodesCreateInfo(data) {
        setTimeout(() => {
            for (let an in this.nodes) {
                console.log(this.nodes[an]);
                try {
                    console.log(data.start_time);
                    console.log(this.time_sync.current_time);
                    console.log((data.start_time - this.time_sync.current_time) * 0.001);
                    console.log(this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                    // this.nodes[an].start(this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                    console.log("start_time", this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                } catch (e) {

                }
            }
            console.log(this.nodes);
        }, 1000);
    }

    moveNoise() {
        const simplex = new SimplexNoise("test");

        setInterval(() => {
            this.noise_player.cutoff_freq = Math.abs(simplex.noise2D(this.time_sync.current_time * 0.0001 + this.position_manager.position[0]*0.05, this.position_manager.position[1]*0.05) * 1000.);
        }, 10.);

    }

    audioEventLoop() {

    }

    // node manager
    resetAllNodes() {
        console.log("reset");
        for (let an in this.nodes) {
            console.log(this.nodes[an]);
            try {
                this.nodes[an].stop();
            } catch (e) {

            }
        }
        this.nodes = {};
    }

    // event mangerなど
    resetAllIntervals() {
        console.log("reset");
        for (let i in this.intervals) {
            console.log(this.intervals[i]);
            try {
                clearInterval(this.intervals[i]);
            } catch (e) {

            }
        }
        this.intervals = {};
    }

    // WebAudioラッパーかな
    playLoadedSource(node_params, time) {
        if (!node_params.params.buffer in this.generator.buffers) console.error("buffer does not found");

        this.generator.createBufferSource(node_params);

        this.generator.connectAudioNode(node_params);

        this.nodes[node_params.name].start(time);

    }

    // グリッチを再生するやつ、ユーティリティーに移動
    playGlitch(out, time) {
        if (Math.random() > 0.25) return;

        const tmp_name = createUniqueHash();

        const s_num = Math.floor(Math.random() * 8);

        const audio_node_params = {
            "name": tmp_name,
            "node_type": "buffer_source",
            "out": out,
            "params": {
                "buffer": "buffer" + s_num,
                "loop": false
            }
        };

        this.playLoadedSource(audio_node_params, time);
    }

    requestTime() {

    }


    // node managerに移動
    disconnect(node1, node2) {
        this.nodes[node1].disconnect(this.nodes[node2]);
    }
}
