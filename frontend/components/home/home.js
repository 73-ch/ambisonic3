
import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
import "./home.css"

export default class {
    constructor() {

        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.messenger = new deviseMessenger(this.messageReceived, this);

        this.context = new AudioContext();
        this.nodes = {};

        this.generator = new AudioNodeGenerator(this.context);

        this.time_sync = new TimeSync(this.context, false, this.messenger);

        // setInterval(() => {console.log(this.time_sync.current_time)}, 200)

        setTimeout(() => {
            this.time_sync.requestTime();
        }, 1000);

        setTimeout(() => {this.messenger.testConnection(); this.messenger.getUserParams();}, 300);
    }

    messageReceived(data) {
        this.time_sync.messageReceived(data);

        switch (data.message) {
            case "audio_nodes":
                this.json = JSON.parse(data.json);
                this.resetAllNodes();
                this.generator.generate(this.json, this.nodes);
                setTimeout(()=> {
                    for (let an in this.nodes) {
                        console.log(this.nodes[an]);
                        try {
                            this.nodes[an].start();
                        } catch (e)  {

                        }
                    }
                    console.log(this.nodes);
                }, 1000);
                break;
            default:
                console.log("data received", data);
                break;
        }
    }

    resetAllNodes (){
        for (let an in this.nodes) {
            console.log(this.nodes[an]);
            try {
                this.nodes[an].stop();
            } catch (e)  {

            }
        }
        this.nodes = {};
    }

    requestTime () {

    }
}
