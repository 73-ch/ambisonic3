// this.nodes[`source1`].start(this.time_sync.getAudioTime($time + 2000));

const params = {
    "name": "source1",
    "node_type": "buffer_source",
    "out": "destination",
    "params": {
        "buffer": "buffer1",
        "loop": false
    }
};

// this.playLoadedSource(params, this.time_sync.getAudioTime($time +  1000));

let i = 1;

setInterval(() => {
    this.playLoadedSource(params, this.time_sync.getAudioTime($time +  1000 * i));
    i++;
}, 1000);

