this.sequencer.resume($time+1000);

let sequence = [["hand0"],[],[],[],["hand0"],[],[],[],["hand0"],[],[],[],["hand0"],[],[],[]];

const light = [1.,0.,0.,1.];
const sub = [.05,.05,.05];
const couple = [light,sub];

let light_seq = [[couple],[],[couple],[],[couple],[],[couple],[],[couple],[],[couple],[],[couple],[],[couple],[]];

// this.sequencer.addSequence(sequence, light_seq);
this.sequencer.addSequence(sequence, light, sub);

// !console.log(this.nodes);
// !console.log(this.time_sync.current_time)

// !location.reload();
// !console.log(this.sequencer.light_sequences);
// !this.sequencer.clearSequence();