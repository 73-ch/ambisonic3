import Messenger from "./messenger";

export default class extends Messenger {
    constructor (fn, _this) {
        super(fn, _this);
        // super.getUserParams();
    }

    requestTime() {
        // this.chat.perform("sync_time", {user_params: })
    }
}
