
const scriptNode = this.context.createScriptProcessor(4096, 1, 1);

const u_pos = parseFloat(this.messenger.user_params);

console.log("u_pos : ", u_pos);

let test = document.createElement("h1");
test.textContent = this.time_sync.current_time;

document.body.appendChild(test);

console.log("u_p : ", this.messenger.user_params);

let count = 0;
// Give the node a function to process audio events
scriptNode.onaudioprocess = (audioProcessingEvent) =>  {
    // The input buffer is the song we loaded earlier
    const inputBuffer = audioProcessingEvent.inputBuffer;

    // The output buffer contains the samples that will be modified and played
    const outputBuffer = audioProcessingEvent.outputBuffer;
    count+=0.1;

    const s_pos = Math.sin(this.time_sync.current_time*0.001) * 10.;
    // test.textContent = this.time_sync.current_time;


    // Loop through the output channels (in this case there is only one)
    for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        let inputData = inputBuffer.getChannelData(channel);
        let outputData = outputBuffer.getChannelData(channel);

        for (let sample = 0; sample < inputBuffer.length; sample++) {
            // make output equal to the same as the input
            outputData[sample] = inputData[sample] * Math.max(10. - Math.abs(s_pos - u_pos), 0.) * .1;
        }
    }
};

const oscillator = this.context.createOscillator();

oscillator.connect(scriptNode);
scriptNode.connect(this.context.destination);

oscillator.start(0);


