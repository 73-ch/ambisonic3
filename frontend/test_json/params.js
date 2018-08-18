//1
this.nodes["osc2"].start(this.getAudioTime($time + 1000.));
this.nodes["osc1"].start(this.getAudioTime($time + 1000.));


// 単純な音像移動
this.intervals.panner_interval = setInterval(() => {
    this.nodes["panner1"].setPosition(Math.sin(this.time_sync.current_time * 0.0005) * 10, 0, 1,);
}, 1.);

// 単純なあたいの変更
this.node["gain"].gain.setValueAtTime(4.0, this.getAudioTime($time + 1000.));


// リズム的に再生
let ii = 0;
this.intervals.rythm = setInterval(() => {
    this.nodes["gain"].gain.setTargetAtTime(3.0,this.getAudioTime($time + 1000.*ii),1.5);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + 1100.*ii),0.125);
    ii++;
}, 1000.);


// エンベロープ
let i = 1;
this.intervals.rich_seq = setInterval(() => {
    this.nodes["gain"].gain.setTargetAtTime(1.0,this.getAudioTime($time + i*1000.),0.00666);
    this.nodes["gain"].gain.setTargetAtTime(0.5,this.getAudioTime($time + i*1000.+20.),0.02666);
    this.nodes["gain"].gain.setTargetAtTime(0.125,this.getAudioTime($time + i*1000+100.),0.170);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + i*1000+600.),0.13333);
    i++;
}, 1000);


// 動作未検証　端末によって剰余で流す音を変える
let i = 1;
this.intervals.rich_seq = setInterval(() => {
    this.nodes["gain"].gain.setTargetAtTime(1.0 * (this.messenger.user_params % 6 == 0),this.getAudioTime($time + i*1000.),0.00666);
    this.nodes["gain"].gain.setTargetAtTime(0.5 * (this.messenger.user_params % 6 == 0),this.getAudioTime($time + i*1000.+20.),0.02666);
    this.nodes["gain"].gain.setTargetAtTime(0.125 * (this.messenger.user_params % 6 == 0),this.getAudioTime($time + i*1000+100.),0.170);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + i*1000+600.),0.13333);
    i++;
}, 1000);

// リッチなオーディオの再生
this.nodes["rich"].start(this.getAudioTime($time + 1000.));

// パラメータで音像移動を再現する
let i = 1;
this.intervals.rich_seq = setInterval(() => {
    let diff = (this.messenger.user_params-3)*100.;
    this.nodes["gain"].gain.setTargetAtTime(1.0,this.getAudioTime($time + i*1000. + diff),0.00366);
    this.nodes["gain"].gain.setTargetAtTime(0.5,this.getAudioTime($time + i*1000.+20. + diff),0.02666);
    this.nodes["gain"].gain.setTargetAtTime(0.125,this.getAudioTime($time + i*1000+100. + diff),0.170);
    this.nodes["gain"].gain.setTargetAtTime(0.0,this.getAudioTime($time + i*1000+600. + diff),0.13333);
    i++;
}, 1000);

// interval系は削除の必要あり
// clearInterval(this.intervals.rich_seq);

// nodesの削除
this.resetAllNodes();