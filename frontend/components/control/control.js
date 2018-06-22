import {sendAudioNodes} from "../../client/sync";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/monokai";

// style
import "./control.css";


export default class {
    constructor() {
        // ace editor
        this.editor = ace.edit("json-editor");
        this.editor.getSession(). setMode('ace/mode/json');
        this.editor.setTheme('ace/theme/monokai');

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
    }

    getJsonText() {
        const json_text = this.editor.getValue();
        this.sendJson(json_text)
    }

    sendJson(json){
        console.log(json);
        sendAudioNodes(json);
    }
}
