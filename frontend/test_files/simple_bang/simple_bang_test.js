// this.nodes[`source1`].start(this.time_sync.getAudioTime($time + 2000));

const params = {
    "name": "source1",
    "node_type": "buffer_source",
    "out": "destination",
    "params": {
        "buffer": "003",
        "loop": false
    }
};

// this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time +  1000));
if (this.intervals.simple) {
    clearInterval(this.intervals.simple)
}

let next_time = $time + 2000;
let ahead = 200;
let span = 1000;



this.intervals.simple = setInterval(() => {
    if (next_time < this.time_sync.current_time + ahead) {
        this.tk.playLoadedSource(params, this.time_sync.getAudioTime(next_time));

        setTimeout(() => {
            this.visualizer.addColor([1.0, 1.0, 1.0, 1.0],[0.05, 0.05, 0.05]);
        }, next_time - this.time_sync.current_time);
        // i++;
        next_time += span;
    }
}, 100);

