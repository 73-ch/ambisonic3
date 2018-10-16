let position = this.position_manager.position;
position = position.map((a) => a - 1);

this.sequencer.setBPM(128);

// let sequence = [["hand0"],["hand0"],["hh1"],["hh1"],["hand0"],[],["hh1"],["hh1"],["hand0"],[],[],[],["hand0"],[],[],[]];
// let sequence = [["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"],["hand0"]];

let sequence = [];
for (let i = 0; i < 16; i++) {
    let child = [];
    // if (i === 0) child.push("003");
    if (i % 8 === position[1]) {
        child.push("hand0");
        child.push("hh2");
    }

    if (position[1] === 3 && i%8 == 4) {
        child.push("hand0");
        child.push("003");
    }
    // if (i % 4 ===0) child.push("hh2");
    // if (i % 4 ===1) child.push("hh2");
    // if (i % 4 ===2) child.push("hh2");

    sequence.push(child);
}

this.sequencer.addSequence(sequence);
this.sequencer.removeSequence(0);

// this.sequencer.resume($time + 2000);


// this.time_sync.startSync();


// this.sequencer.removeSequence(0);

// this.sequencer.clearSequence();

// this.time_sync.default_offset = 480;
// this.nodes["gain"].gain.value = 0.1;



