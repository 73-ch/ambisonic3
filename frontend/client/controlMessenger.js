import Messenger from "./messenger";

export default class extends Messenger {
    constructor (fn, _this) {
        super(fn, _this);
        // super.getUserParams();
    }

    sendAudioNodes (json, start_time) {
        this.chat.perform("send_audio_node_json", {json: json, start_time: start_time});
    }

    sendScript (data) {
        this.chat.perform("send_audio_params", data);
    }
}