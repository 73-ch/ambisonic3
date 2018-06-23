import Sync from "./sync";

export default class extends Sync {
    constructor (fn, _this) {
        super(fn, _this);
        super.getUserParams();
        let test = super.testClass("hello");
        if (test === "hello") console.log('devicesync.js function called');
    }

    requestTime() {
        // this.chat.perform("sync_time", {user_params: })
    }

    testClass (test) {
        console.log('sync.js function called');
        return test;
    }
}
