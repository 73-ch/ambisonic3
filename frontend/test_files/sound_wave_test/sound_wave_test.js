// this.nodes["source3"].start(this.time_sync.getAudioTime($time + 2000));



const node_params = {
    "name": (Math.floor((Math.random() + 5.) ** 20.)).toString(16),
    "node_type": "buffer_source",
    "out": "gain",
    "params": {
        "buffer": "003",
        "loop": false
    }
};

// this..tk.playLoadedSource(node_params, 0);
this.tk.playLoadedSource(node_params, this.time_sync.getAudioTime($time + 2000));
// this.tk.playLoadedSource(node_params, this.time_sync.getAudioTime($time + 1000 + this.position[0] * 100.));

// var i = 1;

// this.intervals.glitch = setInterval(() => {
//     i++;
//     this.tk.playGlitch("gain",this.time_sync.getAudioTime($time + 300 * i));
// }, 300)

// clearInterval(this.intervals.glitch);


// const analyser = this.context.createAnalyser();
// analyser.fftSize = 1024;

// this.nodes["gain"].connect(analyser);

// this.intervals.analyser = setInterval(() => {
//     let data = new Uint8Array(1024);

//     analyser.getByteFrequencyData(data);

//     let sum = 0;

//     sum = data.reduce((a,x) => a+=x,0);

//     sum = sum/200;

//     this.visualizer.color = [sum, sum, sum, 255];

//     //console.log(sum);
// }, 10);