import createChannel from "./cable";

export default class {
    constructor (fn, _this) {
        this.callback = fn;
        this.bound_this = _this;

        const received = (message) => {
            if (this.callback) this.callback.call(this.bound_this, message);
        };

        this.chat = createChannel("SyncChannel", {received});
        console.log(this.chat);
        this.chat.perform("say_hello", {content: "hello from "});
    }

    getUserParams () {
        this.chat.perform("get_user_params");
    }

    testConnection () {
        this.chat.perform("say_hello", {content: "hello from "});
    }

    testClass (test) {
        console.log('sync.js function called');
        return test;
    }
}