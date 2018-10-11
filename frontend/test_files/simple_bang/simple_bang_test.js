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


let i = 1;

this.intervals.simple = setInterval(() => {
    this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time +  1000 * i));

    setTimeout(() => {
        this.visualizer.color = [1.0, 1.0, 1.0, 1.0];
        this.visualizer.sub = [-0.05, -0.05, -0.05];
    }, $time + 1000 * i - this.time_sync.current_time);
    i++;
}, 1000);

