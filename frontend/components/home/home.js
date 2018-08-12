import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
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

            this.time_sync = new TimeSync(this.context, false, this.messenger);

            setTimeout(() => {
                this.messenger.testConnection();
                this.messenger.getUserParams();
            }, 300);

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
                this.resetAllNodes();
                this.generator.generate(this.json, this.nodes);
                setTimeout(() => {
                    for (let an in this.nodes) {
                        console.log(this.nodes[an]);
                        try {
                            console.log(data.start_time);
                            console.log(this.time_sync.current_time);
                            console.log((data.start_time - this.time_sync.current_time) * 0.001);
                            console.log(this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                            this.nodes[an].start(this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                            console.log("start_time", this.context.currentTime + (data.start_time - this.time_sync.current_time) * 0.001);
                        } catch (e) {

                        }
                    }
                    console.log(this.nodes);
                }, 1000);
                break;

            case "audio_params":
                console.log(data.param_name);
                const target = this.nodes[data.name][data["param_name"]];

                console.log(this.nodes[data.name]);

                const time = this.context.currentTime + (data.time - this.time_sync.current_time) * 0.001;

                switch (data.type) {
                    case "set":
                        this.nodes[data.name][data["param_name"]].setValueAtTime(data.value, time);
                        break;
                    case "linear":
                        this.nodes[data.name][data["param_name"]].linearRampToValueAtTime(data.value, time);
                        break;
                    case "exp":
                        this.nodes[data.name][data["param_name"]].exponentialRampToValueAtTime(data.value, time);
                        break;
                    case "target":
                        this.nodes[data.name][data["param_name"]].setTargetAtTime(data.value, time, data.duration);
                        break;
                    case "curve":
                        this.nodes[data.name][data["param_name"]].setValueCurveAtTime(data.value, time, data.duration);
                        break;
                }
                break;
            default:
                // console.log("data received", data);
                break;
        }
    }

    resetAllNodes() {
        for (let an in this.nodes) {
            console.log(this.nodes[an]);
            try {
                this.nodes[an].stop();
            } catch (e) {

            }
        }
        this.nodes = {};
    }

    requestTime() {

    }
}
