import createChannel from "./cable";

export default class {
    constructor(fn, _this) {
        this.callback = fn;
        this.bound_this = _this;

        const received = (data) => {
            if (!this.user_params && data.message === 'user_params') this.user_params = data.user_params;
            if (this.callback) this.callback.call(this.bound_this, data);
        };

        this.chat = createChannel("SyncChannel", {received});
    }

    getUserParams() {
        this.chat.perform("get_user_params", {content: "dummy"});
    }

    testConnection() {
        this.chat.perform("say_hello", {content: "hello from "});
    }
}