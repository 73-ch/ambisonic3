const position = this.position_manager.position;

const num = position.x + position.y * 4;


const seconds_per_beat = 500;

const schedule_ahead = 100;

let next_note_time = $time;
let note_num = 0;


this.intervals.sequence = setInterval(() => {
    if (this.time_sync.current_time > next_note_time + schedule_ahead) {
        schedule(note_num, next_note_time);
        next_note_time += seconds_per_beat * 0.25;
        note_num = (note_num + 1) % 16;
    }
}, 100);

const schedule = (note_num, time) => {
    if (note_num % 4 === 0) {
        playSample("000_bar", time);
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

// current_step = [];