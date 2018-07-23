import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
import "./home.css"

export default class {
    constructor() {
        this.button = document.querySelector("#start");

        this.button.addEventListener('click', (e)=> {
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
        });
    }

    messageReceived(data) {
        this.time_sync.messageReceived(data);

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
                            console.log((data.start_time - this.time_sync.current_time)*0.001);
                            console.log(this.context.currentTime + (data.start_time - this.time_sync.current_time)*0.001);
                            this.nodes[an].start(this.context.currentTime + (data.start_time - this.time_sync.current_time)*0.001);
                            console.log("start_time", this.context.currentTime + (data.start_time - this.time_sync.current_time)*0.001);
                        } catch (e) {

                        }
                    }
                    console.log(this.nodes);
                }, 1000);
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
