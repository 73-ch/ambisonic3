import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";

export default class {
    constructor() {
        this.context = new AudioContext();

        let oscillator;

        this.context.audioWorklet.addModule('./processing.js').then(() => {


            const bypass = new AudioWorkletNode(this.context, 'bypass');


            oscillator = this.context.createOscillator();

            oscillator.connect(bypass);
            bypass.connect(this.context.destination);

            oscillator.start(0);
        });
    }
}