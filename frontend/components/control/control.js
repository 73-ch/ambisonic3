import controlMessenger from "../../client/controlMessenger";
import TimeSync from "../../lib/TimeSync";

import WebMidi from 'webmidi';
import ace from "brace";
import "brace/mode/json";
import "brace/mode/javascript";
import "brace/theme/monokai";

// style
import "./control.css";


export default class {
    constructor() {
        this.messenger = new controlMessenger(this.messageReceived, this);

        this.createUI();

        this.keySetup();

        const start_button = document.querySelector("#start");

        start_button.addEventListener('click', () => {
            start_button.style.display = 'none';
            this.init();
        });

        this.load_offset = document.querySelector('#load-offset');

        window.addEventListener('beforeunload', (e) => {
           e.returnValue = 'reload check';
        });
    }

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.context.createBufferSource().start(0);

        this.time_sync = new TimeSync(this.context, true, this.messenger, true);

        this.midiSetup();

        setTimeout(() => {
            this.messenger.testConnection();
            this.messenger.getUserParams();
        }, 300);
    }

    midiSetup() {
        WebMidi.enable((err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("webmidi enabled");

                this.device = WebMidi.getInputByName("APC MINI");

                console.log(this.device);

                this.device.addListener('noteon', "all", (e) => {this.noteonEvent(e.note.number)});
            }
        });
    }

    noteonEvent(note_num) {
        switch (note_num) {
            case 56:
                this.editor.setValue('{\n' +
                    '  "load_files": [\n' +
                    '    "../audio/000_bar.wav",\n' +
                    '    "../audio/002_foo.wav",\n' +
                    '    "../audio/000.wav",\n' +
                    '    "../audio/001.wav",\n' +
                    '    "../audio/002.wav",\n' +
                    '    "../audio/003.wav",\n' +
                    '    "../audio/004.wav",\n' +
                    '    "../audio/005.wav",\n' +
                    '    "../audio/006.wav",\n' +
                    '    "../audio/007.wav",\n' +
                    '    "../audio/hh1.wav",\n' +
                    '    "../audio/hh2.wav",\n' +
                    '    "../audio/perc0.wav",\n' +
                    '    "../audio/perc1.wav",\n' +
                    '    "../audio/perc2.wav",\n' +
                    '    "../audio/perc3.wav",\n' +
                    '    "../audio/perc4.wav",\n' +
                    '    "../audio/perc5.wav",\n' +
                    '    "../audio/sn.wav",\n' +
                    '    "../audio/bd.wav",\n' +
                    '    "../audio/hand1.wav",\n' +
                    '    "../audio/hand2.wav",\n' +
                    '    "../audio/hand3.wav",\n' +
                    '    "../audio/hand4.wav"\n' +
                    '  ],\n' +
                    '\n' +
                    '  "audio_nodes": [\n' +
                    '    {\n' +
                    '      "name": "gain",\n' +
                    '      "node_type": "gain",\n' +
                    '      "out": "destination",\n' +
                    '      "params": {\n' +
                    '        "gain": 1.0\n' +
                    '      }\n' +
                    '    }\n' +
                    '  ]\n' +
                    '}');
                break;// set audionodes.json
            case 57:
                this.param_editor.setValue('// defines\n' +
                    '\n' +
                    'const L = 16; // length\n' +
                    '\n' +
                    'const sc = this.sequencer;\n' +
                    'const ts = this.time_sync;\n' +
                    'const pm = this.position_manager;\n' +
                    '\n' +
                    'const emp_seq = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];\n' +
                    '\n' +
                    'const white = [1, 1, 1, 1];\n' +
                    'const red = [1., 0., 0., 1.];\n' +
                    'const green = [0., 1., 0., 1.];\n' +
                    'const blue = [0., 0., 1., 1.];\n' +
                    'const empty = [0, 0, 0, 0];\n' +
                    '\n' +
                    'const sub = [.05, .05, .05];\n' +
                    '\n' +
                    '// position settings\n' +
                    'let position = pm.position;\n' +
                    'position = position.map(a => a - 1);\n' +
                    '\n' +
                    'const asc_xy = position[0] + position[1] * 4;\n' +
                    'const asc_yx = position[1] + position[0] * 4;\n' +
                    'const pos_x = position[0];\n' +
                    'const pos_y = position[1];\n' +
                    '\n' +
                    'const desc_xy = 15 - asc_xy;\n' +
                    'const desc_yx = 15 - asc_yx;\n' +
                    'const inv_x = 3 - pos_x;\n' +
                    'const inv_y = 3 - pos_y;\n' +
                    '\n' +
                    'const area = Math.floor(position[0] * .5) + Math.floor(position[1] * .5) * 2.;\n' +
                    '\n' +
                    'const genRandomXY = (i) => {\n' +
                    '    const odd = this.tk.createOdd();\n' +
                    '    return i * odd % L;\n' +
                    '};\n' +
                    '\n' +
                    '\n' +
                    'const center = Math.abs(position[0] - 2) > 1;\n' +
                    '\n' +
                    '\n' +
                    '// sequencer settings\n' +
                    '// const BPM = 128;\n' +
                    '// sc.setBPM(BPM);\n' +
                    'let scene_count = 0;\n' +
                    '\n' +
                    '\n' +
                    '// part0 check sync simple bang\n' +
                    '// (()=> {\n' +
                    '//     let seq = new Array(L);\n' +
                    '//     seq[0] = "003";\n' +
                    '//     sc.addSequence(scene_count, seq);\n' +
                    '//     scene_count++;\n' +
                    '// })();\n' +
                    '\n' +
                    '// part0~3 blank\n' +
                    'for (; scene_count < 4; scene_count++) {\n' +
                    '    sc.addSequence(scene_count, new Array(L));\n' +
                    '}\n' +
                    '\n' +
                    '\n' +
                    '// part4~11\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 8; i++) {\n' +
                    '        let seq = new Array(L);\n' +
                    '\n' +
                    '        if (i === desc_xy || i === asc_xy) seq[0] = "003";\n' +
                    '        sc.addSequence(scene_count, seq);\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 4; i++) {\n' +
                    '        sc.addSequence(scene_count, new Array(L));\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '(() => {\n' +
                    '    let orders = [asc_xy, desc_yx, desc_xy, asc_yx];\n' +
                    '\n' +
                    '    for (let i = 0; i < 4; i++) {\n' +
                    '        let seq = new Array(L * 2);\n' +
                    '        seq[orders[i] * 2] = "003";\n' +
                    '        sc.addSequence(scene_count, seq.slice(0, L));\n' +
                    '        scene_count++;\n' +
                    '        sc.addSequence(scene_count, seq.slice(L, L * 2));\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 4; i++) {\n' +
                    '        sc.addSequence(scene_count, new Array(L));\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '\n' +
                    'let keep_scene = scene_count;\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 20; i++) {\n' +
                    '        let seq = new Array(L);\n' +
                    '        let x = Math.floor(area * .5);\n' +
                    '        let color = i<8?[1,1,1,1]:[0,0,0,0];\n' +
                    '\n' +
                    '        if (i % 2 === x) seq[(area % 2) * L * .5] = "bd";\n' +
                    '\n' +
                    '\n' +
                    '        sc.addSequence(scene_count, seq,color, [.2,.2,.2]);\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    'scene_count = keep_scene;\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 8; i++) {\n' +
                    '        sc.addSequence(scene_count, new Array(L));\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '(() => {\n' +
                    '    let arr = [pos_x, pos_y, inv_x, inv_y];\n' +
                    '    let col = [red, blue, green, white];\n' +
                    '    for (let i = 0; i < arr.length; i++) {\n' +
                    '        let seq = new Array(L);\n' +
                    '        seq[arr[i] * 2] = "hh2";\n' +
                    '        if (arr[i] === 3) seq[(arr[i] + 1) * 2] = "hh2";\n' +
                    '        console.log(col[i]);\n' +
                    '        sc.addSequence(scene_count, seq, col[i], [.1,.1,.1]);\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    'keep_scene = scene_count;\n' +
                    '\n' +
                    '(() => {\n' +
                    '    let col = [0.1, 0.3, 0.7, 0.8];\n' +
                    '    for (let i = 0; i < 8; i++) {\n' +
                    '        let seq = new Array(L);\n' +
                    '        seq[pos_y * 2] = "perc2";\n' +
                    '        seq[9] = "hh2";\n' +
                    '        seq[10] = i % 2 === 0 ? "hh2" : "hh1";\n' +
                    '        sc.addSequence(scene_count, seq, col, sub);\n' +
                    '\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    'scene_count = keep_scene + 4;\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 8; i++) {\n' +
                    '        let seq = new Array(16);\n' +
                    '\n' +
                    '        let index = ((17 + i * 2) * L) % L;\n' +
                    '        seq[index] = "00" + Math.floor(Math.random() * 6);\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '// part5\n' +
                    '(() => {\n' +
                    '    let seq = new Array(L);\n' +
                    '    let l_pat = new Array(L);\n' +
                    '\n' +
                    '    seq[asc_xy] = "hand4";\n' +
                    '    l_pat[desc_xy] = [[...white], [...sub]];\n' +
                    '\n' +
                    '    for (let i = 0; i < 4; i++) {\n' +
                    '        sc.addSequence(scene_count, seq, l_pat);\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();\n' +
                    '\n' +
                    '(() => {\n' +
                    '    for (let i = 0; i < 8; i++) {\n' +
                    '        sc.addSequence(scene_count, new Array(L));\n' +
                    '        scene_count++;\n' +
                    '    }\n' +
                    '})();');
                break;// set scene1.js
            case 58:
                this.param_editor.setValue('const params = {\n' +
                    '    "name": "broadcast",\n' +
                    '    "node_type": "buffer_source",\n' +
                    '    "out": "gain",\n' +
                    '    "params": {\n' +
                    '        "buffer": "003",\n' +
                    '        "loop": false\n' +
                    '    }\n' +
                    '};\n' +
                    '\n' +
                    'let count = 0;\n' +
                    '\n' +
                    'this.intervals.broadcast = setInterval(() => {\n' +
                    '    this.tk.playLoadedSource(params, 0);\n' +
                    '    count++;\n' +
                    '    if (count >= 4) clearInterval(this.intervals.broadcast);\n' +
                    '}, 700);\n' +
                    '\n' +
                    'setTimeout(() => {\n' +
                    '    if (this.intervals.broadcast) clearInterval(this.intervals.broadcast);\n' +
                    '}, 4000);');
                break;// set broadcast_ver.js
            case 59:
                this.param_editor.setValue('const params = {\n' +
                    '    "name": "broadcast",\n' +
                    '    "node_type": "buffer_source",\n' +
                    '    "out": "gain",\n' +
                    '    "params": {\n' +
                    '        "buffer": "003",\n' +
                    '        "loop": false\n' +
                    '    }\n' +
                    '};\n' +
                    '\n' +
                    'let count = 0;\n' +
                    '\n' +
                    'this.intervals.date_object = setInterval(() => {\n' +
                    '    this.tk.playLoadedSource(params, ($date + 2000 + 700 * count - this.time_sync.calcDateTime()) * 0.001);\n' +
                    '\n' +
                    '    count++;\n' +
                    '    if (count >= 4) clearInterval(this.intervals.date_object);\n' +
                    '}, 700);\n' +
                    '\n' +
                    'setTimeout(() => {\n' +
                    '    if (this.intervals.date_object) clearInterval(this.intervals.date_object);\n' +
                    '}, 4000);\n' +
                    '\n');
                break;// set date_object_ver.js
            case 60:
                this.param_editor.setValue('this.time_sync.default_offset = 240;\n' +
                    'const params = {\n' +
                    '    "name": "broadcast",\n' +
                    '    "node_type": "buffer_source",\n' +
                    '    "out": "gain",\n' +
                    '    "params": {\n' +
                    '        "buffer": "003",\n' +
                    '        "loop": false\n' +
                    '    }\n' +
                    '};\n' +
                    '\n' +
                    'let count = 0;\n' +
                    '\n' +
                    'this.intervals.sync_test = setInterval(() => {\n' +
                    '    this.tk.playLoadedSource(params, this.time_sync.getAudioTime($time + 2000 + count * 700));\n' +
                    '\n' +
                    '    count++;\n' +
                    '    if (count >= 4) clearInterval(this.intervals.sync_test);\n' +
                    '}, 700);\n' +
                    '\n' +
                    'setTimeout(() => {\n' +
                    '    if (this.intervals.sync_test) clearInterval(this.intervals.sync_test);\n' +
                    '}, 4000);');
                break;// set time_sync_ver.js
            case 61:
                this.param_editor.setValue('this.noise_player.generateLowpassFilter();\n' +
                    'this.noise_player.generateNoiseOscillator();\n' +
                    'this.noise_player.lowpass_filter.connect(this.nodes["gain"]);\n' +
                    'this.noise_player.noise_osc.connect(this.noise_player.lowpass_filter);\n' +
                    'this.noise_player.setPosition(this.position_manager.position);\n' +
                    '\n' +
                    'this.noise_player.move();');
                break;// set noise_test.js
            case 82:
                this.reloadAllDevices();
                break;
            case 83:
                this.messenger.sendScript({"text": "this.time_sync.stopSync()"});
                break;
            case 84:
                this.messenger.sendScript({"text": "this.time_sync.startSync()"});
                break;
            case 85:
                this.messenger.sendScript({"text": `this.sequencer.resume(${this.time_sync.current_time+ 3000});`});
                break;
            case 86:
                this.messenger.sendScript({"text": "this.sequencer.clearSequence()"});
                break;
            case 87:
                this.messenger.sendScript({"text": "this.sequencer.stop()"});
                break;
            case 89:
                this.sendScript();
                break;
            case 98:
                this.getJsonText();
                break;
            default:
                break;
        }
    }

    createUI() {
        this.editor = ace.edit("json-editor");
        this.editor.getSession().setMode('ace/mode/json');
        this.editor.setTheme('ace/theme/monokai');
        this.editor.getSession().tabSize = 2;

        this.param_editor = ace.edit("script-editor");
        this.param_editor.getSession().setMode('ace/mode/javascript');
        this.param_editor.setTheme('ace/theme/monokai');
        this.param_editor.getSession().tabSize = 2;

        const send_json_button = document.querySelector("#send-json");
        send_json_button.addEventListener("click", () => {
            this.getJsonText();
        });

        const send_script_button = document.querySelector("#send-script");
        send_script_button.addEventListener("click", () => {
            this.sendScript();
        });

        const reload_devices_button = document.querySelector("#reload-devices");
        reload_devices_button.addEventListener("click", () => {
            this.reloadAllDevices();
        });
    }

    getJsonText() {
        const json_text = this.editor.getValue();
        this.sendJson(json_text)
    }

    sendJson(json) {
        console.log(json);
        console.log(this.time_sync.current_time);
        console.log(this.time_sync.current_time + parseFloat(this.load_offset.value));
        this.messenger.sendAudioNodes(json, this.time_sync.current_time + parseFloat(this.load_offset.value));
    }

    reloadAllDevices() {
        this.messenger.sendScript({"text": "location.reload()"});
    }

    sendScript() {
        const editor_text = this.param_editor.getValue();

        let send_text = editor_text.replace(/\$time/g, this.time_sync.current_time);
        send_text = send_text.replace(/\$date/g, this.time_sync.calcDateTime());

        let compel = send_text.match(/\n\![^\n]*/g);
        if (compel) {
            compel = compel.map(a => a.replace(/\!/g, ""));
            send_text = compel.join("");
        }

        this.messenger.sendScript({"text": send_text});
    }

    keySetup() {
        // command or ctrl flag
        this.key_press = false;

        // keyboard event
        window.addEventListener("keydown", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode !== 13) {
                this.key_press = true;
            } else if (e.keyCode === 13 && this.key_press) {
                // if command or ctrl & enter pushed, send json
                this.sendScript();

            }
        });
        window.addEventListener("keyup", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && (e.keyCode === 91 || e.keyCode === 93)))) {
                this.key_press = false;
            }
        });
    }

    messageReceived(data) {
        this.time_sync.messageReceived(data);

        switch (data.action) {
            default:
                // console.log("data received", data);
                break;
        }
    }
}
