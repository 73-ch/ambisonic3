// for (var i = 0; i <8; i++) {
//     this.nodes[`source${i}`].start(this.getAudioTime($time + 2000 + 500*i))
// }

// var i = 1;

// this.intervals.glitch = setInterval(() => {
//     i++;
//     this.playGlitch("gain",this.getAudioTime($time + 300 * i));
// }, 300)

// clearInterval(this.intervals.glitch);


const analyser = this.context.createAnalyser();
analyser.fftSize = 1024;

this.nodes["gain"].connect(analyser);

this.intervals.analyser = setInterval(() => {
    let data = new Uint8Array(1024);

    analyser.getByteFrequencyData(data);

    let sum = 0;

    sum = data.reduce((a,x) => a+=x,0);

    sum = sum/200;

    this.visualizer.color = [sum, sum, sum, 255];

    //console.log(sum);
}, 10);