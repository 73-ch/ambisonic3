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

this.intervals.broadcast = setInterval(() => {
    this.tk.playLoadedSource(params, 0);
    count++;
    if (count >= 4) clearInterval(this.intervals.broadcast);
}, 700);

