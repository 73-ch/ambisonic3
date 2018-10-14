// let params = {
//       "name": "source1",
//       "node_type": "buffer_source",
//       "out": "gain",
//       "params": {
//         "buffer": "foot",
//         "loop": true
//       }
//     };

// this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time+ 2000));

this.nodes["source1"].start(this.time_sync.getAudioTime($time+ 2000));

if (this.intervals.update) clearInterval(this.intervals.update);

this.intervals.update = setInterval(() => {

    let t = this.time_sync.current_time * 0.0002;

    let position = [Math.cos(t) * 1.5+2.5, Math.sin(t) *1.5+2.5, 0];
    let distance = this.position_manager.getDistance(position);


    this.nodes["gain"].gain.value = Math.max((1.0 - distance),0.0);
}, 10);


// this.nodes["gain"].gain.value = 1.;

// this.time_sync.default_offset = 480.;


