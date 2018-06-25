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

        let tolerance_obj = document.createElement("h3");
        document.body.insertBefore(tolerance_obj, document.body.firstChild);

        let time_obj = document.createElement("h1");
        document.body.insertBefore(time_obj, document.body.firstChild);

        this.time_table = document.querySelector('#init-time-table');

        setInterval(() => {
            tolerance_obj.textContent = "tolerance : " + this.tolerance;
            time_obj.textContent = this.current_time;
        }, 50);

        setInterval(() => {
            this.requestTime();
            this.averageTolerate();
        }, 1000);
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
        if (this.tolerances.length >= 10) {
            for (let i = 0; i < 10; i++) sum += this.tolerances[this.tolerances.length - i - 1];
            this.tolerance = sum / 10.;
            while (this.tolerances.length > 10){
                this.tolerances.shift();
                this.time_table.deleteRow(1);
            }

        } else {
            for (let tole of this.tolerances) {
                sum += tole;
            }

            this.tolerance = sum === 0 ? 0 : sum / this.tolerances.length;
        }
    }

    messageReceived(data) {
        switch (data.message) {
            case 'time_sync':
                let now = this.system_time;
                let culc = (now - data.t1) / 2. + data.t2 - now;
                this.tolerances.push(culc);
                let row = this.time_table.insertRow(this.time_table.rows.length);
                row.insertCell(-1).innerHTML = data.t1;
                row.insertCell(-1).innerHTML = now;
                row.insertCell(-1).innerHTML = now - data.t1;
                row.insertCell(-1).innerHTML = data.t2;
                row.insertCell(-1).innerHTML = culc;
                break;
        }
    }
}