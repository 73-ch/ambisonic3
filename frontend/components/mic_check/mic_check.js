import MicInput from "../../lib/MicInputTest";
import AudioNodeGenerator from "../../lib/AudioNodeGenerator";

const MicCheck = class {
    constructor() {
        this.context = new AudioContext();

        this.mic_input = new MicInput(this.context);

        this.generator = new AudioNodeGenerator(this.context);
    }
};
export default MicCheck