// defines

const L = 16; // length

const sc = this.sequencer;
const ts = this.time_sync;
const pm = this.position_manager;

const emp_seq = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

const white = [1, 1, 1, 1];
const red = [1., 0., 0., 1.];
const green = [0., 1., 0., 1.];
const blue = [0., 0., 1., 1.];
const empty = [0, 0, 0, 0];

const sub = [.05, .05, .05];

// position settings
let position = pm.position;
position = position.map(a => a - 1);

const asc_xy = position[0] + position[1] * 4;
const asc_yx = position[1] + position[0] * 4;
const pos_x = position[0];
const pos_y = position[1];

const desc_xy = 15 - asc_xy;
const desc_yx = 15 - asc_yx;
const inv_x = 3 - pos_x;
const inv_y = 3 - pos_y;

const area = Math.floor(position[0] * .5) + Math.floor(position[1] * .5) * 2.;

const genRandomXY = (i) => {
    const odd = this.tk.createOdd();
    return i * odd % L;
};


const center = Math.abs(position[0] - 2) > 1;


// sequencer settings
// const BPM = 128;
// sc.setBPM(BPM);
let scene_count = 0;


// part0 check sync simple bang
// (()=> {
//     let seq = new Array(L);
//     seq[0] = "003";
//     sc.addSequence(scene_count, seq);
//     scene_count++;
// })();

// part0~3 blank
for (; scene_count < 4; scene_count++) {
    sc.addSequence(scene_count, new Array(L));
}


// part4~11
(() => {
    for (let i = 0; i < 8; i++) {
        let seq = new Array(L);

        if (i === desc_xy || i === asc_xy) seq[0] = "003";
        sc.addSequence(scene_count, seq);
        scene_count++;
    }
})();

(() => {
    for (let i = 0; i < 4; i++) {
        sc.addSequence(scene_count, new Array(L));
        scene_count++;
    }
})();

(() => {
    let orders = [asc_xy, desc_yx, desc_xy, asc_yx];

    for (let i = 0; i < 4; i++) {
        let seq = new Array(L * 2);
        seq[orders[i] * 2] = "003";
        sc.addSequence(scene_count, seq.slice(0, L));
        scene_count++;
        sc.addSequence(scene_count, seq.slice(L, L * 2));
        scene_count++;
    }
})();


(() => {
    for (let i = 0; i < 4; i++) {
        sc.addSequence(scene_count, new Array(L));
        scene_count++;
    }
})();


let keep_scene = scene_count;

(() => {
    for (let i = 0; i < 20; i++) {
        let seq = new Array(L);
        let x = Math.floor(area * .5);
        let color = i<8?[1,1,1,1]:[0,0,0,0];

        if (i % 2 === x) seq[(area % 2) * L * .5] = "bd";


        sc.addSequence(scene_count, seq,color, [.2,.2,.2]);
        scene_count++;
    }
})();

scene_count = keep_scene;

(() => {
    for (let i = 0; i < 8; i++) {
        sc.addSequence(scene_count, new Array(L));
        scene_count++;
    }
})();

(() => {
    let arr = [pos_x, pos_y, inv_x, inv_y];
    let col = [red, blue, green, white];
    for (let i = 0; i < arr.length; i++) {
        let seq = new Array(L);
        seq[arr[i] * 2] = "hh2";
        if (arr[i] === 3) seq[(arr[i] + 1) * 2] = "hh2";
        console.log(col[i]);
        sc.addSequence(scene_count, seq, col[i], [.1,.1,.1]);
        scene_count++;
    }
})();

keep_scene = scene_count;

(() => {
    let col = [0.1, 0.3, 0.7, 0.8];
    for (let i = 0; i < 8; i++) {
        let seq = new Array(L);
        seq[pos_y * 2] = "perc2";
        seq[9] = "hh2";
        seq[10] = i % 2 === 0 ? "hh2" : "hh1";
        sc.addSequence(scene_count, seq, col, sub);

        scene_count++;
    }
})();

scene_count = keep_scene + 4;

(() => {
    for (let i = 0; i < 8; i++) {
        let seq = new Array(16);

        let index = ((17 + i * 2) * L) % L;
        seq[index] = "00" + Math.floor(Math.random() * 6);
    }
})();

// part5
(() => {
    let seq = new Array(L);
    let l_pat = new Array(L);

    seq[asc_xy] = "hand4";
    l_pat[desc_xy] = [[...white], [...sub]];

    for (let i = 0; i < 4; i++) {
        sc.addSequence(scene_count, seq, l_pat);
        scene_count++;
    }
})();

(() => {
    for (let i = 0; i < 8; i++) {
        sc.addSequence(scene_count, new Array(L));
        scene_count++;
    }
})();

// part6
// (() => {
//     const ni = asc_xy * 19 % L;
//     let seq = new Array(L);
//     let l_pat = new Array(L);
//     seq[ni] =
//
// })();

// 前からタ・タ・タ・タ・タン
/*
for (let j = 0; j < 4; j++) {
    let pos = -3 * (j % 2 - 1) + position[Math.floor(j * .5)] * (j % 2 * 2 - 1);
    let t = [];
    for (let i = 0; i < l; i++) {
        let child = [];
        if (i % 4 === 0) {
            child.push("bd");
        }

        if (i % 8 === pos) {
            child.push("hand0");
            child.push("hh2");
        }

        if (pos === 3 && i % 8 === 4) {
            child.push("hand0");
            child.push("003");
        }
        t.push(child);
    }
    sc.addSequence(t);
*/
// }


// full_hh
// let full_hh = emp_seq.concat();
// for (let i = 0; i < l; i++) {
//     if (i % 4 === 0) full_hh[i].push("bd");
//     full_hh[i].push("hh2");
// }
// sc.addSequence(full_hh);

// !console.log(this.sequencer.sequences);
