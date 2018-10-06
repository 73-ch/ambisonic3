const seconds_per_beat = 500;
const schedule_ahead = 200;

let next_note_time = $time;
let note_num_16th = 0;
let sequence_count = 0;

let position = this.position_manager.position;
position = position.map((a) => a - 1);

let sequence = [];

// [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

// sequence.push([["000_bar", "002_foo"],[],["002_foo"],["003"],[],["000_bar"],["002_foo"],[],["000_bar"],[],["000_bar"],["000_bar"],[],["000_bar"],["000_bar"],[]],);
// sequence.push([[],["000_bar"],[],["003"],["003"],["003"],["000_bar"],[],[],[],["000_bar"],[],[],[],["000_bar"],[]]);



// let seq = [["000_bar"],[],[],[],["000_bar"],[],[],[],["000_bar"],[],[],[],["000_bar"],[],[],[]];
let seq = [["000_bar"],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

let id_2 = (position[0] % 2) * 2 + position[1]% 2;


let id_3 = (position[0] % 4);
let id_4 = (position[1] % 4);

console.log(id_3, id_4);


seq = seq.map((a, i, array) => array[(i - id_3*4 + 16) % 16]);
sequence.push(seq);

// const id_1 = position[0]*4 + position[1];



clearInterval(this.intervals.analyser);
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

const analyser = this.context.createAnalyser();
analyser.fftSize = 1024;

this.nodes["gain"].connect(analyser);

this.intervals.analyser = setInterval(() => {
    let data = new Uint8Array(1024);

    analyser.getByteFrequencyData(data);

    let sum = 0;

    sum = data.reduce((a,x) => a+=x,0);

    sum = sum/20000;

    this.visualizer.color = [sum, sum, sum, 1.0];

    console.log(sum);
}, 10);