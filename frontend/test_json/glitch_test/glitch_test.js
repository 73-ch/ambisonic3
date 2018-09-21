for (var i = 0; i <8; i++) {
    this.nodes[`source${i}`].start(this.getAudioTime($time + 2000 + 500*i))
}

this.playGlitch("gain",this.getAudioTime($time + 2000));