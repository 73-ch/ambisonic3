this.time_sync.default_offset = 240;
const params = {
    "name": "broadcast",
    "node_type": "buffer_source",
    "out": "gain",
    "params": {
        "buffer": "003",
        "loop": false
    }
};

let count = 0;

this.intervals.sync_test = setInterval(() => {
    this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time + 2000 + count * 700));

    count++;
    if (count >= 4) clearInterval(this.intervals.sync_test);
}, 700);

setTimeout(() => {
    if (this.intervals.sync_test) clearInterval(this.intervals.sync_test);
}, 4000);