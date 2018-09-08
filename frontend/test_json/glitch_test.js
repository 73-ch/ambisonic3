for (var i = 0; i <8; i++) {
    this.nodes[`source${i}`].start(this.getAudioTime($time + 2000 + 500*i))
}


this.playLoadedAudioFile({
    "name": "source3",
    "node_type": "buffer_source",
    "out": "gain",
    "params": {
        "buffer": "buffer7",
        "loop": false
    }
}, this.getAudioTime($time + 2000));

this.playGlitch("gain",this.getAudioTime($time + 2000));