
this.nodes["osc2"].start(this.getAudioTime($time + 1000.));
this.nodes["osc1"].start(this.getAudioTime($time + 1000.));

this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 1000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 1100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 2000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 2100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 3000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 3100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 4000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 4100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 5000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 5100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 6000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 6100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 7000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 7100.),0.125);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 8000.),1.5);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 8100.),0.125);


let i = 1;
for (let i = 0; i < 100;i++){
    this.nodes["panner1"].positionX.setValueAtTime(Math.sin(this.time_sync.current_time / 4000.0), $time + i*1000);
}

this.panner_interval = setInterval(() => {
    this.nodes["panner1"].setPosition(Math.sin(this.time_sync.current_time * 0.0005) * 10, 0, 1,);
}, 1.);


// this.nodes["osc2"].start(this.getAudioTime($time + 1000.));
// this.nodes["osc1"].start(this.getAudioTime($time + 1000.));


this.panner_interval = setInterval(() => {
    this.nodes["panner1"].setPosition(Math.sin(this.time_sync.current_time * 0.0005) * 10, 0, 1,);
}, 1.);


// this.nodes["osc2"].start(this.getAudioTime($time + 1000.));
// this.nodes["osc1"].start(this.getAudioTime($time + 1000.));
// this.context.listener.setPosition((this.messenger.user_params - 4), 0,0);

// this.node["gain"].gain.setValueAtTime(4.0, this.getAudioTime($time + 1000.));

this.panner_interval = setInterval(() => {
    this.nodes["panner1"].setPosition(Math.sin(this.time_sync.current_time * 0.005) * 6, 0, 1,);
}, 1.);

this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 1000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 1100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 2000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 2100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 3000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 3100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 4000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 4100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 5000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 5100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 6000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 6100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 7000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 7100.),2.5);
this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 8000.),0.125);
this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 8100.),2.5);

let ii = 0;

setInterval(() => {

    this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 1000.*ii),1.5);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 1100.*ii),0.125);

    ii++;
}, 1000.);


let i = 1;
this.rich_seq = setInterval(() => {
    this.nodes["gain"].gain.setTargetAtTime(1.0,this.getAudioTime($time + i*1000.),0.00666);
    this.nodes["gain"].gain.setTargetAtTime(0.5,this.getAudioTime($time + i*1000.+20.),0.02666);
    this.nodes["gain"].gain.setTargetAtTime(0.125,this.getAudioTime($time + i*1000+100.),0.170);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + i*1000+600.),0.13333);
    i++;
}, 1000);

this.nodes["rich"].start(this.getAudioTime($time + 1000.));

// this.nodes["gain"].gain.setValueAtTime(0.,this.getAudioTime($time + 1000.));

// let i = 1;
// this.rich_seq = setInterval(() => {
//     let diff = (this.messenger.user_params-4)*100.;
//     this.nodes["gain"].gain.setTargetAtTime(1.0,this.getAudioTime($time + i*1000. + diff),0.00366);
//     this.nodes["gain"].gain.setTargetAtTime(0.5,this.getAudioTime($time + i*1000.+20. + diff),0.02666);
//     this.nodes["gain"].gain.setTargetAtTime(0.125,this.getAudioTime($time + i*1000+100. + diff),0.170);
//     this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + i*1000+600. + diff),0.13333);
//     i++;
// }, 1000);

// clearInterval(this.rich_seq);