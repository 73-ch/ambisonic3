import DateWithOffset from "date-with-offset";
import platform from "platform";

/*
    各タイマーの単位・精度
    js Date.getTime() : 1/ 1000sec = msec,　1msecまでの精度
    js AudioContext.currentTime : 1sec, 1.0 * Math.pow(10, -15)
    js HighResolutionTimer : 1/ 1000sec = msec, 1.0 * Math.pow(10. -16);

 */

const N_SAMPLE = 10;

export default class {
    constructor(context, useHRT, messenger, debug) {
        // WebSocketをオーバーライドして、タイムスタンプの精度を向上させる
        // this.overrideWebSocketNative();

        this.context = context;
        this.context.createBufferSource().start(0);
        this.useHRT = useHRT;

        this.tolerance = 0;
        this.tolerances = [];
        this.request_count = 0;
        this.stability = 0.5;

        this.messenger = messenger;

        this.init_time = this.calcInitTime();
        console.log("init_time : ", this.init_time, performance.now(), context.currentTime);
        this.setGetTime();

        this.debug = debug;
        if (this.debug) {
            this.debugInit();
        }

        // 1秒おきにアップデート処理を走らせる
        this.startSync();

        this.default_offset = 480;
    }

    debugInit() {
        const stability_obj = document.createElement("h4");
        document.body.insertBefore(stability_obj, document.body.firstChild);

        const tolerance_obj = document.createElement("h3");
        document.body.insertBefore(tolerance_obj, document.body.firstChild);

        const time_obj = document.createElement("h1");
        document.body.insertBefore(time_obj, document.body.firstChild);

        this.time_table = document.querySelector('#init-time-table');

        setInterval(() => {
            stability_obj.textContent = "stability : " + this.stability;
            tolerance_obj.textContent = "tolerance : " + this.tolerance;
            time_obj.textContent = this.current_time;
        }, 10);
    }

    overrideWebSocketNative() {
        const that = this;

        const old_send = window.WebSocket.prototype.send;

        const _send = function (data) {
            let json = JSON.parse(data);
            let message_data = JSON.parse(json.data);

            if (message_data["action"] === "sync_time") message_data.t1 = that.system_time;

            json.data = JSON.stringify(message_data);

            old_send.call(this, JSON.stringify(json));
        };

        window.WebSocket.prototype.send = _send;

        // console.log(window.WebSocket);
        //
        // Object.definePropertiy(window.WebSocket.prototype, "onmessage", {
        //     set(func){
        //         console.log("set");
        //         this._onmessage = func;
        //     },
        //     get() {
        //         console.log("get");
        //         return this._onmessage;
        //     }
        // });


        // const test2 = window.WebSocket.prototype.onmessage;
        //
        // const _onmessage = function(event) {
        //     let message_data = JSON.parse(event.data);
        //     console.log("websockt_receive_time : ", that.system_time);
        //     // message_data.
        //     test2.call(this, event);
        // }

    }

    calcInitTime() {
        const NOW = new DateWithOffset(0);
        const TODAY = new DateWithOffset(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0);
        return NOW.getTime() - TODAY.getTime();
    }

    calcDateTime() {
        const NOW = new DateWithOffset(0);
        const TODAY = new DateWithOffset(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0);
        return NOW.getTime() - TODAY.getTime();
    }

    setGetTime() {
        if (this.useHRT) {
            this.getTime = () => {
                return this.init_time + performance.now();
            };
        } else {
            this.getTime = () => {
                return this.init_time + this.context.currentTime * 1000;
                // return this.calcInitTime();
            };
        }
    }

    get system_time() {
        return this.getTime();
        // return this.calcInitTime();
    }

    get current_time() {
        return this.getTime() + this.tolerance;
        // return this.calcInitTime();
    }

    getAudioTime(_time) {
        // console.log(this.context.currentTime);
        let default_offset = 0;
        if (!platform.name === 'Safari' || platform.os.family === 'iOS') {
            // this.default_offset = 220;
            console.log(this.default_offset);
            return this.context.currentTime + (_time - this.current_time + this.default_offset) * 0.001;
        } else {
            return this.context.currentTime + (_time - this.current_time) * 0.001;
        }



        // return (_time - this.init_time - this.tolerance) * 0.001;
    }

    requestTime() {
        this.messenger.requestTime({id: this.request_count, t1: this.system_time});
        this.request_count++;
    }

    startSync() {
        if (this.status) this.stopSync();

        this.status = true;

        this.interval = setInterval(() => {
            this.requestTime();
            // console.log(`date offset : ${this.current_time - this.calcInitTime()}`);
        }, 1000);
    }

    stopSync() {
        if (!this.status) return false;

        clearInterval(this.interval);
        this.status = false;
    }

    averageTolerate() {
        let sum = 0;
        if (this.tolerances.length >= N_SAMPLE) {
            let max = -10000000000, min = 10000000000;
            for (let i = 0; i < N_SAMPLE; i++) {
                sum += this.tolerances[this.tolerances.length - i - 1];
                if (max < this.tolerances[this.tolerances.length - i - 1]) max = this.tolerances[this.tolerances.length - i - 1];
                if (min > this.tolerances[this.tolerances.length - i - 1]) min = this.tolerances[this.tolerances.length - i - 1];
            }
            let t_temp = sum / N_SAMPLE;
            let n = 0;
            sum = 0;

            for (let i = 0; i < N_SAMPLE; i++) {
                let disp = this.tolerances[this.tolerances.length - i - 1] - t_temp;
                if (disp ** 2.0 >= (max - min) ** 2.0 * 0.2) continue;
                sum += this.tolerances[this.tolerances.length - i - 1];
                n++;
            }

            let b_temp = this.tolerance;
            let n_temp = n === 0 ? t_temp : sum / n;

            this.stability = Math.min(Math.abs(b_temp - n_temp) * 0.05, .8);

            this.tolerance = b_temp * (1. - this.stability) + n_temp * this.stability;

            while (this.tolerances.length > N_SAMPLE) {
                this.tolerances.shift();

                if (this.debug) this.time_table.deleteRow(1);
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
                const now = this.system_time;
                const interval = now - data.t1;

                if (interval >= 150) {
                    console.log("over");
                    return;
                }


                let culc = interval * .5 + data.t2 - now;
                this.tolerances.push(culc);
                // if (this.tolerances.length > N_SAMPLE) return;

                // this.tolerance = this.tolerance * 0.8 + culc * 0.2;

                // this.tolerance = culc;

                this.averageTolerate();

                if (this.debug) {
                    let row = this.time_table.insertRow(this.time_table.rows.length);
                    row.insertCell(-1).innerHTML = data.t1;
                    row.insertCell(-1).innerHTML = now;
                    row.insertCell(-1).innerHTML = interval;
                    row.insertCell(-1).innerHTML = data.t2;
                    row.insertCell(-1).innerHTML = culc;
                }

                // while (this.tolerances.length > N_SAMPLE) {
                //     this.tolerances.shift();
                //
                //     if (this.debug) this.time_table.deleteRow(1);
                // }

                break;
            default:
                break;
        }
    }
}