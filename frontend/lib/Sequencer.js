import AudioToolKit from "./AudioToolKit";

export default class {
    constructor(_context, _time_sync, _visualizer, _tk) {
        this.sequences = [];
        this.context = _context;
        this.time_sync = _time_sync;
        this.visualizer = _visualizer;

        this.next_note_time = 0;
        this.ahead = 200;
        this.sequence_count = 0;
        this.note_num_16th = 0;

        this.seconds_per_beat = 500;

        this.interval = null;

        this.tk = _tk;
    }

    addSequence(sequence) {
        this.sequences.push(sequence);
    }

    removeSequence(index) {
        this.sequences.splice(index, 1);
    }

    clearSequence() {
        this.sequences = [];
    }

    setBPM(bpm) {
        this.seconds_per_beat = 60000 / bpm;
    }

    resume(time) {
        this.next_note_time = time;

        this.interal = setInterval(() => {
            this.main();
        }, 50);
    }

    stop() {
        clearInterval(this.interval);
    }

    main() {
        if (this.time_sync.current_time > this.next_note_time + this.ahead) {
            if (this.sequences.length > 0) {
                console.log(this.sequence_count);
                this.schedule(this.sequence_count, this.note_num_16th, this.next_note_time);
            }

            // next_note_time,
            this.next_note_time += this.seconds_per_beat * 0.25;
            this.note_num_16th++;

            if (this.note_num_16th >= 16) {
                this.note_num_16th %= 16;
                this.sequence_count = (this.sequence_count + 1) % this.sequences.length | 0;
            }
        }
    }

    schedule(count, note_num, time) {
        const target = this.sequences[count][note_num];
        if (!target) return;
        if (target.length >= 1) {
            for (let sample of target) {
                this.playSample(sample, time);
            }
        }
    }

    playSample(buffer_name, time) {
        const bar_params = {
            "name": "source_"+buffer_name+"_"+time,
            "node_type": "buffer_source",
            "out": "gain",
            "params": {
                "buffer": buffer_name,
                "loop": false
            }
        };

        // console.log( this.time_sync.getAudioTime(time));
        this.tk.playLoadedSource(bar_params, this.time_sync.getAudioTime(time));

        // visualizer
        setTimeout(() => {
            this.visualizer.color = [1.0, 1.0, 1.0, 1.0];
            this.visualizer.sub = [-0.05, -0.05, -0.05];
        }, this.next_time);

    }
}
