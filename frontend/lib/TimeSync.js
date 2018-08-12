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
        }, 1);


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
        // console.log('send');
        this.messenger.requestTime({id: this.request_count, t1: this.system_time});
    }

    averageTolerate() {
        let sum = 0;
        if (this.tolerances.length >= 10) {
            let max = -10000000000, min = 10000000000;
            for (let i = 0; i < 10; i++) {
                sum += this.tolerances[this.tolerances.length - i - 1];
                if (max < this.tolerances[this.tolerances.length - i - 1]) max = this.tolerances[this.tolerances.length - i - 1];
                if (min > this.tolerances[this.tolerances.length - i - 1]) min = this.tolerances[this.tolerances.length - i - 1];
            }
            let t_temp = sum / 10.;
            let n = 0;
            sum = 0;

            for (let i = 0; i < 10; i++) {

                let disp = this.tolerances[this.tolerances.length - i - 1] - t_temp;
                if (disp ** 2.0 >= (max - min)**2.0 *0.2) continue;
                sum += this.tolerances[this.tolerances.length - i - 1];
                n++;
            }

            this.tolerance = n === 0 ? t_temp : sum / n;
            // this.tolerance += sum;

            // console.log(sum, n);

            while (this.tolerances.length > 10) {
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
        switch (data.action) {
            case 'time_sync':
                console.log('receive');
                let now = this.system_time;
                let culc = (now - data.t1) * .5 + data.t2 - now;
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