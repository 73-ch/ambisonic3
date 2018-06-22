
import {sayHello, setCallback} from "../../client/sync";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import "./home.css"

export default class {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        setCallback(this.messageReceived, this);

        this.context = new AudioContext();
        this.nodes = {};

        this.generator = new AudioNodeGenerator(this.context);

        setTimeout(sayHello, 1000);
    }

    messageReceived(data) {
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
}
