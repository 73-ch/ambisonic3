import Messenger from "./messenger";

export default class extends Messenger {
    constructor (fn, _this) {
        super(fn, _this);
        // super.getUserParams();
    }

    sendAudioNodes (json) {
        this.chat.perform("send_audio_node_json", {json: json});
    }
}