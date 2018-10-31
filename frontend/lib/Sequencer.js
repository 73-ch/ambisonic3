// import AudioToolKit from "./AudioToolKit";
import clone from 'clone';

const emp_seq = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

const Sequencer = class {
    constructor(_context, _time_sync, _visualizer, _tk) {
        this.context = _context;
        this.time_sync = _time_sync;
        this.visualizer = _visualizer;

        this.sequences = [];
        this.light_sequences = [];

        this.next_note_time = 0;
        this.ahead = 200;
        this.sequence_count = 0;
        this.note_num_16th = 0;

        this.setBPM(64);

        this.interval = null;
        this.interval_span = 25;

        this.status = false;

        this.tk = _tk;
    }

    addSequence(...args) {
        console.log(args);
        let light_pattern;

        if (args.length === 2) {// index, sequence
            light_pattern = this.createDefaultLightPattern(args[1], [1, 1, 1, 1], [.05, .05, .05]);
        } else if (args.length === 3) {// index, sequence, light_sequence
            light_pattern = args[2];
        } else if (args.length === 4) {// index, sequence, light, sub
            light_pattern = this.createDefaultLightPattern(args[1], args[2], args[3]);
        }

        this.addPattern(this.sequences, args[0], args[1]);
        this.addPattern(this.light_sequences, args[0], light_pattern);
    }


    addPattern(type, seq_index, pattern) {
        while (type.length <= seq_index) type.push(clone(emp_seq));

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i]) type[seq_index][i].push(pattern[i]);
        }

    }

    createDefaultLightPattern(seq, col, sub) {
        console.log(seq, col, sub);
        let ret_pattern = [];
        for (let i = 0; i < seq.length; i++) {
            let p = [];

            if (seq[i]) p = [col, sub];

            ret_pattern.push(p);
        }

        return ret_pattern;
    }

    removeSequence(index) {
        this.sequences.splice(index, 1);
    }

    clearSequence() {
        this.sequences = [];
        this.light_sequences = [];
    }

    setBPM(bpm) {
        this.seconds_per_beat = 60000 / bpm;
    }

    resume(time) {
        if (this.status === true) this.stop();
        this.status = true;
        this.next_note_time = time;
        // this.note_num_16th = 0;
        // this.sequence_count = 0;

        // if (this.interval) clearInteral(this.interval);

        this.interval = setInterval(() => {
            this.main();
        }, this.interval_span);
    }

    stop() {
        if (this.status === true) {
            clearInterval(this.interval);
            this.status = false;
        }
    }

    main() {
        if (this.time_sync.current_time > this.next_note_time + this.ahead) {
            if (this.sequences.length > 0) {
                this.schedule(this.sequence_count, this.note_num_16th, this.next_note_time);
            }

            // next_note_time,
            this.next_note_time += this.seconds_per_beat * 0.0625;
            this.note_num_16th++;

            if (this.note_num_16th >= 16) {
                this.note_num_16th %= 16;
                this.sequence_count = (this.sequence_count + 1) % this.sequences.length | 0;
                console.log(this.sequence_count);
            }
        }
    }

    schedule(count, note_num, time) {
        const target = this.sequences[count][note_num];
        if (!target) return;
        if (target.length >= 1) {
            console.log(target);
            for (let sample of target) {
                this.playSample(sample, time);
            }
        }

        const lights = this.light_sequences[count][note_num];
        if (!lights) return;
        if (lights.length >= 1) {
            for (let c of lights) {
                if (c.length === 2) this.flashDisplay(c, time);
            }
        }

    }

    playSample(buffer_name, time) {
        const bar_params = {
            "name": "source_" + buffer_name + "_" + time,
            "node_type": "buffer_source",
            "out": "gain",
            "params": {
                "buffer": buffer_name,
                "loop": false
            }
        };

        // console.log( this.time_sync.getAudioTime(time));
        this.tk.playLoadedSource(bar_params, this.time_sync.getAudioTime(time));
    }

    flashDisplay(couple, time) {
        // visualizer
        setTimeout(() => {
            this.visualizer.addColor(couple[0].concat(), couple[1].concat());
        }, time - this.time_sync.current_time);
    }
};

export default Sequencer;
