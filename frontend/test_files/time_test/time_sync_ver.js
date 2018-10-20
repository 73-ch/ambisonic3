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

this.intervals.date_object = setInterval(() => {
    this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time + 2000 + count * 700));

    count++;
    if (count >= 4) clearInterval(this.intervals.date_object);
}, 700);

