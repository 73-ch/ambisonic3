export default class {
    constructor(_context) {
        this.context = _context;

        this.q = 1.0;
        this.cutoff_freq = 500.;

        this.buffer_size = 8192;
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

        // simple lowpass

        // this.lowpass_filter = this.context.createScriptProcessor(this.buffer_size, 1, 1);
        // this.lastOut = 0.0;
        // this.lowpass_filter.onaudioprocess = (e) => {
        //     let input = e.inputBuffer.getChannelData(0);
        //     let output = e.outputBuffer.getChannelData(0);
        //     for (let i = 0; i < this.buffer_size; i++) {
        //         output[i] = (input[i] + this.lastOut) / this.q;
        //         this.lastOut = output[i];
        //     }
        // }


        // iir filter ver

        // const denominators = [];
        // const numerators = [];
        //
        // // fd は，　ディジタルフィルタのカットオフ周波数. fc は，アナログフィルタのカットオフ周波数
        // // つまり, ここでは, ディジタルフィルタのカットオフ周波数をアナログフィルタのカットオフ周波数に変換しています.
        // const fc = Math.tan((Math.PI * this.cutoff_freq) / sample_rate) / (2 * Math.PI);
        //
        // // Q は, クオリティファクタ
        // const d = 1 + ((2 * Math.PI * fc) / this.q) + (4 * Math.pow(Math.PI, 2) * Math.pow(fc, 2));
        //
        // // Low-Pass Filter の分母の係数を算出しています
        // denominators[0] = 1;
        // denominators[1] = ((8 * Math.pow(Math.PI, 2) * Math.pow(fc, 2)) - 2) / d;
        // denominators[2] = (1 - ((2 * Math.PI * fc) / this.q) + (4 * Math.pow(Math.PI, 2) * Math.pow(fc, 2))) / d;
        //
        // // Low-Pass Filter の分子の係数を算出しています
        // numerators[0] = (4 * Math.pow(Math.PI, 2) * Math.pow(fc, 2)) / d;
        // numerators[1] = (8 * Math.pow(Math.PI, 2) * Math.pow(fc, 2)) / d;
        // numerators[2] = (4 * Math.pow(Math.PI, 2) * Math.pow(fc, 2)) / d;
        //
        // this.lowpass_filter = this.context.createIIRFilter(numerators, denominators);
    }

    updateDenominator() {
        denominators[0] = 1;
        denominators[1] = ((8 * Math.pow(Math.PI, 2) * Math.pow(fc, 2)) - 2) / d;
        denominators[2] = (1 - ((2 * Math.PI * fc) / this.q) + (4 * Math.pow(Math.PI, 2) * Math.pow(fc, 2))) / d;

        this.lowpass_filter.denominators = denominators;
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