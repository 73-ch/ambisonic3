name,param_name,type,value,time,duration

panner1,positionX,target,20.,1000.,3000.;

gain,gain,target,3.0,1000.,1.5.;
gain,gain,target,0.0,1100.,0.125;
gain,gain,target,3.0,2000.,1.5.;
gain,gain,target,0.0,2100.,0.125;
gain,gain,target,3.0,3000.,1.5.;
gain,gain,target,0.0,3100.,0.125;
gain,gain,target,3.0,4000.,1.5.;
gain,gain,target,0.0,4100.,0.125;
gain,gain,target,3.0,5000.,1.5.;
gain,gain,target,0.0,5100.,0.125;
gain,gain,target,3.0,6000.,1.5.;
gain,gain,target,0.0,6100.,0.125;
gain,gain,target,3.0,7000.,1.5.;
gain,gain,target,0.0,7100.,0.125;
gain,gain,target,3.0,8000.,1.5.;
gain,gain,target,0.0,8100.,0.125;
gain,gain,target,3.0,9000.,1.5.;
gain,gain,target,0.0,9100.,0.125;
gain,gain,target,3.0,10000.,1.5.;
gain,gain,target,0.0,10100.,0.125;
gain,gain,target,3.0,11000.,1.5.;
gain,gain,target,0.0,11100.,0.125;
gain,gain,target,3.0,12000.,1.5.;
gain,gain,target,0.0,12100.,0.125;
gain,gain,target,3.0,13000.,1.5.;
gain,gain,target,0.0,13100.,0.125;
gain,gain,target,3.0,14000.,1.5.;
gain,gain,target,0.0,14100.,0.125;
gain,gain,target,3.0,15000.,1.5.;
gain,gain,target,0.0,15100.,0.125;
gain,gain,target,3.0,16000.,1.5.;
gain,gain,target,0.0,16100.,0.125;

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