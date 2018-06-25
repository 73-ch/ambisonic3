import controlMessenger from "../../client/controlMessenger";
import TimeSync from "../../lib/TimeSync";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/monokai";

// style
import "./control.css";


export default class {
    constructor() {
        this.messenger = new controlMessenger(this.messageReceived, this);

        // ace editor
        this.editor = ace.edit("json-editor");
        this.editor.getSession().setMode('ace/mode/json');
        this.editor.setTheme('ace/theme/monokai');
        this.editor.getSession().tabSize = 2;

        // command or ctrl flag
        this.key_press = false;

        // keyboard event
        window.addEventListener("keydown", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey))&& e.keyCode !== 13) {
                this.key_press = true;
            } else if (e.keyCode === 13 && this.key_press) {
                // if command or ctrl & enter pushed, send json
                this.getJsonText();
            }
        });
        window.addEventListener("keyup", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && (e.keyCode === 91 || e.keyCode === 93)))) {
                this.key_press = false;
            }
        });

        setTimeout(() => {this.messenger.testConnection(); this.messenger.getUserParams();}, 300);


        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.time_sync = new TimeSync(this.context, false, this.messenger);

        setTimeout(() => {
            this.messenger.testConnection();
            this.messenger.getUserParams();
        }, 300);

        this.load_offset = document.querySelector('#load-offset');
    }

    getJsonText() {
        const json_text = this.editor.getValue();
        this.sendJson(json_text)
    }

    sendJson(json){
        console.log(json);
        console.log(this.time_sync.current_time);
        console.log(this.time_sync.current_time + parseFloat(this.load_offset.value));
        this.messenger.sendAudioNodes(json, this.time_sync.current_time + parseFloat(this.load_offset.value));
    }

    messageReceived(data) {
        this.time_sync.messageReceived(data);

        switch (data.message) {
            default:
                // console.log("data received", data);
                break;
        }
    }
}
