import controlMessenger from "../../client/controlMessenger";
import TimeSync from "../../lib/TimeSync";
import ace from "brace";
import "brace/mode/json";
import "brace/mode/javascript";
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

        // param editor
        this.param_editor = ace.edit("param-editor");
        this.param_editor.getSession().setMode('ace/mode/javascript');
        this.param_editor.setTheme('ace/theme/monokai');
        this.param_editor.getSession().tabSize = 2;

        // param submit
        this.param_submit = document.querySelector("#param-send");

        this.param_submit.addEventListener("click", () => {
            this.getJsonText();
        });

        // command or ctrl flag
        this.key_press = false;

        // keyboard event
        window.addEventListener("keydown", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode !== 13) {
                this.key_press = true;
            } else if (e.keyCode === 13 && this.key_press) {
                // if command or ctrl & enter pushed, send json
                this.sendParams();

            }
        });
        window.addEventListener("keyup", (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && (e.keyCode === 91 || e.keyCode === 93)))) {
                this.key_press = false;
            }
        });

        const start_button = document.querySelector("#start");

        start_button.addEventListener('click', () => {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.context.createBufferSource().start(0);

            this.time_sync = new TimeSync(this.context, true, this.messenger);

            setTimeout(() => {
                this.messenger.testConnection();
                this.messenger.getUserParams();
            }, 300);
        });

        this.load_offset = document.querySelector('#load-offset');
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

    sendParams() {
        const editor_text = this.param_editor.getValue();

        const send_text = editor_text.replace(/\$time/g, this.time_sync.current_time);

        console.log(send_text);

        this.messenger.sendParams({"text": send_text});

        // const params = editor_text.replace(/[\n\r\s]/g, "").split(";");

        // for (let p of params) {
        //     console.log(p);
        //     if (p.length == 0) continue;
        //     const p_components = p.split(',');
        //     const data = {
        //         "name": p_components[0],
        //         "param_name":p_components[1],
        //         "type": p_components[2],
        //         "value": parseFloat(p_components[3]),
        //         "time": parseFloat(p_components[4]) + this.time_sync.current_time,
        //         "duration": parseFloat(p_components[5])
        //     };
        //     console.log(data);
        //     // this.messenger.sendParams(data);
        // }
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
