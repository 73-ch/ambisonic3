import SimplexNoise from "simplex-noise";

export default class {
    constructor(_context, _time_sync, _visualizer) {
        this.context = _context;
        this.time_sync = _time_sync;
        this.visualizer = _visualizer;

        this.q = 1.0;
        this.cutoff_freq = 500.;

        this.buffer_size = 8192;
        this.pos = [0,0,0];

        this.main = null;

        this.time_p = 0.0001;
        this.pos_p = 0.05;
    }

    generateLowpassFilter() {
        // const sample_rate = this.context.sampleRate;

        // this.lowpass_filter = this.context.createScriptProcessor(this.buffer_size, 1, 1);
        //
        // const PI_2_div_sample_rate = Math.PI*2.0/sample_rate;
        //
        //
        // this.lowpass_filter.onaudioprocess = (e) => {
        //     let omega = PI_2_div_sample_rate * this.cutoff_freq;
        //     let alpha = Math.sin(omega) / (2.0 * this.q);
        //
        //     let a0 = 1.0 + alpha;
        //
        //     let a1 = -2.0 * Math.cos(omega) / a0;
        //     let a2 = (1.0 - alpha) / a0;
        //     let b0 = (1.0 - Math.cos(omega)) * .5 / a0;
        //     let b1 = (1.0 - Math.cos(omega)) / a0;
        //
        //     let in1 = 0, in2 = 0;
        //     let out1 = 0, out2 = 0;
        //
        //     const input = e.inputBuffer.getChannelData(0);
        //     const output = e.outputBuffer.getChannelData(0);
        //
        //     for (let i = 0; i < this.buffer_size; i++) {
        //         output[i] = b0 * input[i] + b1 * in1 + b0 * in2 - a1 * out1 - a2 * out2;
        //
        //         in2 = in1;
        //         in1 = input[i];
        //
        //         out2 = out1;
        //         out1 = output[i];
        //     }
        //
        // };

        // biquad filter ver

        this.lowpass_filter = this.context.createBiquadFilter();
        this.lowpass_filter.type = "lowpass";
        this.lowpass_filter.Q.value = this.q;
        this.lowpass_filter.frequency.value = this.cutoff_freq;

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

    setPosition(_pos) {
        if (_pos.length !== 3) console.error("given position is wrong");
        this.pos = _pos;
    }

    move() {
        const simplex = new SimplexNoise("test");
        this.visualizer.sub = [0.0,0.0,0.0,0.];

        if (this.main) clearInterval(this.main);

        this.main = setInterval(() => {
            const noise = Math.abs(simplex.noise2D(this.time_sync.current_time * this.time_p + this.pos[0]*this.pos_p, this.pos[1]*this.pos_p));
            // this.cutoff_freq = noise * 1000.;
            this.lowpass_filter.frequency.value = noise * 1000.;
            this.lowpass_filter.Q.value = this.Q;

            this.visualizer.colors = [{color: [noise,noise,noise,1.0], sub:[.05,.05,.05]}];
        }, 10.);
    }

    stop() {
        if (this.main) clearInterval(this.main);
        this.main = null;
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