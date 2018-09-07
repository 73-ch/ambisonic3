import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
import {playAudioFile, getAudioTime} from "../../lib/LiveCodingUtilities";
import "./home.css"

export default class {
    constructor() {
        this.button = document.querySelector("#start");

        this.button.addEventListener('click', (e) => {
            this.button.style.display = 'none';

            console.log("start");

            const AudioContext = window.AudioContext || window.webkitAudioContext;

            this.messenger = new deviseMessenger(this.messageReceived, this);

            this.context = new AudioContext();
            this.context.createBufferSource().start(0);
            this.nodes = {};
            this.generator = new AudioNodeGenerator(this.context);

            this.time_sync = new TimeSync(this.context, true, this.messenger);

            setTimeout(() => {
                this.messenger.testConnection();
                this.messenger.getUserParams();
                console.log(this.context.listener);
            }, 300);

            setTimeout(() => {
                console.log(this.context.listener);
            }, 600);


            this.listener_x = document.querySelector(".listener-x");
            this.listener_y = document.querySelector(".listener-y");
            this.listener_z = document.querySelector(".listener-z");

            this.listener_x.addEventListener("change", () => {
                this.moveListener();
            });
            this.listener_y.addEventListener("change", () => {
                this.moveListener();
            });
            this.listener_z.addEventListener("change", () => {
                this.moveListener();
            });

            this.intervals = {};
        });


    }

    moveListener() {
        console.log("listener_position", this.context.listener.positionX, this.context.listener.positionY, this.context.listener.positionZ);
        this.generator.listener_position = [this.listener_x.value, this.listener_y.value, this.listener_z.value]
    }

    messageReceived(data) {
        this.time_sync.messageReceived(data);
        // console.log(data);
        switch (data.action) {
            case "audio_nodes":
                this.json = JSON.parse(data.json);
                // this.resetAllNodes();
                this.generator.generate(this.json, this.nodes);
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
                break;

            case "audio_params":
                console.log(data);
                // const time = this.context.currentTime + (data.time - this.time_sync.current_time) * 0.001;
                eval(data.text);

                // switch (data.type) {
                //     case "set":
                //         this.nodes[data.name][data["param_name"]].setValueAtTime(data.value, time);
                //         break;
                //     case "linear":
                //         this.nodes[data.name][data["param_name"]].linearRampToValueAtTime(data.value, time);
                //         break;
                //     case "exp":
                //         this.nodes[data.name][data["param_name"]].exponentialRampToValueAtTime(data.value, time);
                //         break;
                //     case "target":
                //         this.nodes[data.name][data["param_name"]].setTargetAtTime(data.value, time, data.duration);
                //         break;
                //     case "curve":
                //         this.nodes[data.name][data["param_name"]].setValueCurveAtTime(data.value, time, data.duration);
                //         break;
                //     case "start":
                //         this.nodes[data.name].start(time);
                //         break;
                //     case "stop":
                //         this.nodes[data.name].stop(time);
                //         break;
                //     case "reset_all":
                //         this.resetAllNodes();
                //         break;
                //
                // }
                break;
            default:
                // console.log("data received", data);
                break;
        }
    }

    getAudioTime(_time) {
        return this.context.currentTime + (_time - this.time_sync.current_time) * 0.001;
    }

    audioEventLoop() {

    }

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

    playLoadedAudioFile(node_params, time) {
        if (!node_params.params.buffer in this.generator.buffers) console.error("buffer does not found");

        this.generator.createBufferSource(node_params);

        this.generator.connectAudioNode(node_params);

        this.nodes[node_params.name].start(time);

    }

    requestTime() {

    }
}
