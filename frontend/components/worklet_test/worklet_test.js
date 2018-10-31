import deviseMessenger from "../../client/deviceMessenger";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";
import TimeSync from "../../lib/TimeSync";
import AudioContextWrapper from "../../lib/StuckAudioBuffers";

const WorkletTest = class {
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

        // const AudioContext = window.AudioContext || window.webkitAudioContext;
        //
        // this.context = new AudioContext();
        //
        //
        // this.wrapper = new AudioContextWrapper(this.context);
        // console.log(this.wrapper.loaded_buffers);
        //
        // let load = this.wrapper.loadFiles(["../audio/003.wav","../audio/004.wav"]);
        // load.then(() => {
        //     console.log(this.wrapper.loaded_buffers);
        //
        //     // this.wrapper.deleteLoadedBuffer("003.wav");
        // });
    }
};
export default WorkletTest