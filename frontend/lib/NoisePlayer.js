export default class {
    constructor(_context) {
        this.context = _context;

        this.q = 1.0;
        this.cutoff_freq = 500.;

        this.buffer_size = 4096;
    }

    generateLowpassFilter() {
        const sample_rate = this.context.sampleRate;

        this.lowpass_filter = this.context.createScriptProcessor(this.buffer_size, 1, 1);

        const PI_2_div_sample_rate = Math.PI*2.0/sample_rate;


        this.lowpass_filter.onaudioprocess = (e) => {
            let omega = PI_2_div_sample_rate * this.cutoff_freq;
            let alpha = Math.sin(omega) / (2.0 * this.q);

            let a0 = 1.0 + alpha;

            let a1 = -2.0 * Math.cos(omega) / a0;
            let a2 = (1.0 - alpha) / a0;
            let b0 = (1.0 - Math.cos(omega)) * .5 / a0;
            let b1 = (1.0 - Math.cos(omega)) / a0;

            let in1 = 0, in2 = 0;
            let out1 = 0, out2 = 0;

            const input = e.inputBuffer.getChannelData(0);
            const output = e.outputBuffer.getChannelData(0);

            for (let i = 0; i < this.buffer_size; i++) {
                output[i] = b0 * input[i] + b1 * in1 + b0 * in2 - a1 * out1 - a2 * out2;

                in2 = in1;
                in1 = input[i];

                out2 = out1;
                out1 = output[i];
            }

        };
    }

    generateNoiseOscillator() {
        this.noise_osc = this.context.createScriptProcessor(this.buffer_size, 1, 1);

        this.noise_osc.onaudioprocess = (e) => {
            let output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < this.buffer_size; i++) {
                output[i] = Math.random() * 2 - 1;
            }

        };
    }
}