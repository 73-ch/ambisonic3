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

                this.device.addListener('noteon', "all", (e) => {this.noteonEvent(e)});
            }
        });
    }

    noteonEvent(e) {
        console.log(`noteon ${e.note.number}`);

        if (isNaN(e.note.number)) console.error('midi message is wrong');

        switch (e.note.number) {
            case 0:
                this.reloadAllDevices();
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
