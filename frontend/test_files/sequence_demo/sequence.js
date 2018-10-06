const position = this.position_manager.position;

const num = position[0]*4 + position[1];

console.log(num);

const seconds_per_beat = 500;

const schedule_ahead = 200;

let next_note_time = $time;
let note_num_16th = 0;
let sequence_count = 0;
// [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
let sequence = [
    [["000_bar", "002_foo"],[],["002_foo"],["003"],[],["000_bar"],["002_foo"],[],["000_bar"],[],["000_bar"],["000_bar"],[],["000_bar"],["000_bar"],[]],
    [[],["000_bar"],[],["003"],["003"],["003"],["000_bar"],[],[],[],["000_bar"],[],[],[],["000_bar"],[]]
];

clearInterval(this.intervals.sequence);


this.intervals.sequence = setInterval(() => {
    if (this.time_sync.current_time > next_note_time + schedule_ahead) {
        schedule(sequence_count, note_num_16th, next_note_time);
        next_note_time += seconds_per_beat * 0.25;
        note_num_16th++;
        if (note_num_16th >= 16) {
            note_num_16th %= 16;
            sequence_count = (sequence_count + 1) % sequence.length;
        }
    }
}, 100);

const schedule = (count, note_num, time) => {
    const target = sequence[count][note_num];
    if (!target) return;
    if (target.length >= 1) {
        for (let sample of target) {
            playSample(sample, time);
        }
    }
};

const playSample = (buffer_name, time) => {
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
    this.playLoadedSource(bar_params, this.time_sync.getAudioTime(time));
};

