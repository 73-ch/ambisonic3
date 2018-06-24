import messenger from "../client/messenger";
import DateWithOffset from "date-with-offset";

/*
    各タイマーの単位・精度
    js Date.getTime() : 1/ 1000sec = msec,　1msecまでの精度
    js AudioContext.currentTime : 1sec, 1.0 * Math.pow(10, -15)
    js HighResolutionTimer : 1/ 1000sec = msec, 1.0 * Math.pow(10. -16);

 */

export default class {
    constructor (context, useHRT, messenger) {
        this.context = context;
        this.useHRT = useHRT;

        const NOW = new DateWithOffset(0);
        const TODAY = new DateWithOffset(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0);
        const OFFSET = NOW.getTime() - TODAY.getTime();

        this.init_time = OFFSET;
        console.log("init_time : ", this.init_time);
        this.setGetTime();

        this.tolerance = 0;
        this.tolerances = [];
        this.tolerance_sum = 0;

        this.request_count = 0;

        this.messenger = messenger;
    }

    setGetTime() {
        if (this.useHRT) {
            this.getTime = () => {
                return this.init_time + performance.now();
            }
        } else {
            this.getTime = () => {
                return this.init_time + this.context.currentTime * 1000;
            }
        }
    }

    get current_time() {
        return this.getTime();
    }

    requestTime () {
        this.messenger.requestTime({id: this.request_count, t1: this.current_time});
    }

    messageReceived(data) {
        switch (data.message) {
            case 'time_sync':
                data.t3 = this.current_time;
                console.log(data);
                break;
        }
    }
}