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
    this.tk.playLoadedSource(params, ($date + 2000 + 700 * count - this.time_sync.init_time) * 0.001);

    count++;
    if (count >= 4) clearInterval(this.intervals.date_object);
}, 700);

