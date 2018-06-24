import DateWithOffset from "date-with-offset";

/*
    各タイマーの単位・精度
    js Date.getTime() : 1/ 1000sec = msec,　1msecまでの精度
    js AudioContext.currentTime : 1sec, 1.0 * Math.pow(10, -15)
    js HighResolutionTimer : 1/ 1000sec = msec, 1.0 * Math.pow(10. -16);

 */

export default class {
    constructor(context, useHRT, messenger) {
        this.context = context;
        this.context.createBufferSource().start(0);
        this.useHRT = useHRT;

        const NOW = new DateWithOffset(0);
        const TODAY = new DateWithOffset(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0);
        const OFFSET = NOW.getTime() - TODAY.getTime();

        this.init_time = OFFSET;
        console.log("init_time : ", this.init_time);
        this.setGetTime();

        this.tolerance = 0;
        this.tolerances = [];
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

    get system_time() {
        return this.getTime();
    }

    get current_time() {
        return this.getTime() + this.tolerance;
    }

    requestTime() {
        this.messenger.requestTime({id: this.request_count, t1: this.system_time});
    }

    averageTolerate() {
        let sum = 0;
        if (this.tolerances.length >= 3) {
            for (let i = 0; i < 3; i++) {
                sum += this.tolerances[this.tolerances.length - i-1];
            }
            this.tolerance = sum / 3.;
        } else {
            for (let tole of this.tolerances) {
                sum += tole;
            }
            this.tolerance = sum === 0 ? 0 :sum / this.tolerances.length;
            console.log(sum);
        }
    }

    messageReceived(data) {
        switch (data.message) {
            case 'time_sync':
                let culc = (this.system_time - data.t1) / 2.+ data.t2 - this.system_time;
                this.tolerances.push(culc);
                break;
        }
    }
}