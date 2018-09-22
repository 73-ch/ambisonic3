

const analyser = this.context.createAnalyser();
analyser.fftSize = 1024;

this.nodes["osc1"].connect(analyser);

const network_latency = this.time_sync.current_time - $time;

console.log(network_latency)

this.nodes["osc1"].start(this.getAudioTime($time + 3000));
performance.mark("osc_scheduled");


this.intervals.analyser = setInterval(() => {
    let data = new Uint8Array(1024);

    analyser.getByteFrequencyData(data);

    let sum = 0;

    sum = data.reduce((a,x) => a+=x,0);

    sum = sum/200;


    if (sum > 1) {
        performance.mark("osc_play");

        performance.measure("osc", "osc_scheduled", "osc_play");

        console.log(performance.getEntriesByName("osc"));

        const osc_span = performance.getEntriesByName("osc", "measure")[0].duration;

        console.log(`bang_span : ${osc_span + network_latency}`);
        clearInterval(this.intervals.analyser);
    }

    console.log(sum);
}, 1);
