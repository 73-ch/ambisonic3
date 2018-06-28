import MicInput from "../../lib/MicInputTest";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";

export default class {
    constructor() {
        this.context = new AudioContext();

        this.mic_input = new MicInput(this.context);

        this.generator = new AudioNodeGenerator(this.context);
    }
}