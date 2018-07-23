import * as CONST from "./ntp/definitions";
import DateWithOffset from "date-with-offset";
import {F, P, C, M, S, V, X} from "./ntp/AssociationDataStructure"

/*
    各タイマーの単位・精度
    js Date.getTime() : 1/ 1000sec = msec,　1msecまでの精度
    js AudioContext.currentTime : 1sec, 1.0 * Math.pow(10, -15)
    js HighResolutionTimer : 1/ 1000sec = msec, 1.0 * Math.pow(10. -16);
h
 */

const LOG2D = (a) => {
    return a < 0. ? 1. / (1 << -(a)) : 1 << (a);
};


export default class {
    constructor(context, useHRT, messenger) {
        this.context = context;
        this.useHRT = useHRT;

        const NOW = new DateWithOffset(0);
        const TODAY = new DateWithOffset(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0);
        const OFFSET = NOW.getTime() - TODAY.getTime();

        this.init_time = OFFSET;
        console.log("init_time : ", this.init_time);
        this.setGetTime();

        this.tolerance = 0;

        this.messenger = messenger;

        let tolerance_obj = document.createElement("h3");
        document.body.insertBefore(tolerance_obj, document.body.firstChild);

        let time_obj = document.createElement("h1");
        document.body.insertBefore(time_obj, document.body.firstChild);

        this.time_table = document.querySelector('#init-time-table');

        // ntp begin
        // initialize system variables
        this.s = new S();

        this.s.leap = CONST.NOSYNC;
        this.s.poll = CONST.MINPOLL;
        this.s.precision = CONST.PRECISION;
        this.s.p = null;
        console.log(this.s);

        // initialize local clock variables
        this.c = new C();
        this.rstclock(CONST.NSET, 0, 0);
        this.c.jitter = LOG2D(this.s.precision);
        console.log(this.c);

        // mobilizeの実装
        this.p = new P();
        this.p.mode = 3;
        this.p.hpoll = CONST.MINPOLL;
        this.clear(this.p, CONST.X_INIT);

        setInterval(() => {
            this.clock_adjust();
            console.log("status s c", this.s, this.c);
        }, 1000);

        setInterval(() => {
            time_obj.textContent = this.current_time;
        }, 10);
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

    adjust_time(offset) {
        console.log('adjust_time', this.current_time, offset);
        this.tolerance = offset;
    }

    step_time(offset) {
        this.tolerance = offset;
    }

    receive(r) {
        console.log("receive", this.current_time, r);
        if (CONST.CHECK) {
            if (r.xmt == 0) {
                console.error("invalid timestamp");
                return;
            }

            if (r.xmt == this.p.xmt) {
                console.error("duplicate packet");
                return;
            }
        }

        if (r.org == 0 || r.org != this.p.xmt) return;

        this.p.org = r.xmt;
        this.p.rec = r.dst;

        this.packet(this.p, r);
    }

    packet(p, r) {
        console.log("packet", this.current_time, p, r);
        let offset, delay, disp;

        p.leap = r.leap;

        p.mode = r.mode;
        p.ppoll = r.poll;
        p.root_delay = r.root_delay;
        p.root_disp = r.root_disp;
        p.refid = r.refid;
        p.reftime = r.reftime;


        if (p.leap == CONST.NOSYNC) return;

        if (r.root_delay * .5 + r.root_disp >= CONST.MAXDISP || p.reftime > r.xmt) return;

        this.poll_update(p, p.hpoll);

        p.reach |= 1;

        offset = ((r.rec - r.org) + (r.dst - r.xmt)) * 0.5000000000;
        delay = Math.max(r.dst - r.org, r.rec - r.xmt, LOG2D(this.s.precision));
        disp = LOG2D(r.precision) + LOG2D(this.s.precision) + CONST.PHI * (r.dst - r.org); // 桁数が揃っていない可能性あり

        this.clock_filter(p, offset, delay, disp);
    }

    clock_filter(p, offset, delay, disp) {
        console.log("clock_filter", this.current_time, offset, delay, disp);
        let f = [];
        for (let i = 1; i < CONST.NSTAGE; i++) {
            p.f[i] = p.f[i - 1];
            p.f[i].disp += CONST.PHI * (this.c.t - p.t);
            f[i] = p.f[i];
        }

        p.f[0].t = this.c.t;
        p.f[0].offset = offset;
        p.f[0].delay = delay;
        p.f[0].disp = disp;
        f[0] = p.f[0];

        let dtemp = p.offset;
        p.offset = f[0].offset;
        p.disp = f[0].disp;
        for (let i = 0; i < CONST.NSTAGE; i++) {
            // console.log(f[i].disp);
            // console.log(2 ** (i + 1));
            // console.log(f[i].disp / (2 ** (i + 1)));
            p.disp += f[i].disp / (2 ** (i + 1));
            p.jitter += (f[i].offset - f[0].offset) ** 2.;
        }


        p.jitter = Math.max(Math.sqrt(p.jitter), LOG2D(this.s.precision));

        if (f[0].t - p.t <= 0) return;

        console.log("a", Math.abs(p.offset - dtemp));
        console.log("b", CONST.SGATE * p.jitter);
        console.log("c", (f[0].t - p.t));
        console.log("d", 2 * this.s.poll);

        if (Math.abs(p.offset - dtemp) > CONST.SGATE * p.jitter && (f[0].t - p.t) < 2 * this.s.poll) return; // ここで毎回return

        p.t = f[0].t;

        if (p.burst == 0) this.clock_select();

    }

    clock_select() {
        console.log('clock_select', this.current_time, this.s);
        let _p = this.s.p;
        let p = this.p;
        this.s.p = null;
        let n = 0;

        if (this.accept(p)) {
            this.s.m[n].p = p;
            this.s.m[n].type = +1;
            this.s.m[n].edge = p.offset + this.root_dist(p);
            this.s.v[n].p = p;
            n++;
            this.s.m[n].p = p;
            this.s.m[n].type = 0;
            this.s.m[n].edge = p.offset;
            this.s.v[n].p = p;
            n++;
            this.s.m[n].p = p;
            this.s.m[n].type = -1;
            this.s.m[n].edge = p.offset - this.root_dist(p);
            this.s.v[n].p = p;
            n++;
        }

        console.log("N", n);

        console.log(this.s.m);
        
        let low = 2e9, high = -2e9;
        let allow, found, chime;
        for (allow = 0; 2 * allow < n; allow++) {
            found = 0;
            chime = 0;

            for (let i = 0; i < n; i++) {
                chime -= this.s.m[i].type;
                if (chime >= n - found) {
                    low = this.s.m[i].edge
                }

                if (this.s.m[i].type === 0) found++;
            }

            chime = 0;
            for (let i = n - 1; i >= 0; i--) {
                chime += this.s.m[i].type;
                if (chime >= n - found) {
                    high = this.s.m[i].edge;
                    break;
                }
                if (this.s.m[i].type === 0) found++;
            }

            if (found > allow) continue;

            if (high > low) break;
        }

        console.log('high', high, 'low', low, 'chime', chime, 'allow', allow, 'found', found);

        n = 0;
        for (let i = 0; i < n; i++) {
            if (this.s.m[i].edge < low || s.m[i].edge > high) continue;

            p = this.s.m[i].p;
            this.s.v[n].p = p;
            this.s.v[n].metric = this.root_dist(p);
            n++;
        }

        if (n === CONST.NSANE) return;

        while (1) {
            let p, q, qmax;
            let max = -2e9, min = 2e9;
            for (let i = 0; i < n; i++) {
                this.p = this.s.v[i].p;
                if (this.p.jitter < min) min = p.jitter;

                dtemp = 0;
                for (let j = 0; j < n; j++) {
                    q = this.s.v[j].p;
                    dtemp += (this.p.offset - q.offset) ** 2.0;
                }

                dtemp = Math.sqrt(dtemp);
                if (dtemp > max) {
                    max = dtemp;
                    qmax = q;
                }
            }

            if (max < min || n <= CONST.NMIN) break;

            n--;
        }
        this.s.p = this.s.v[0].p;

        this.s.p = this.p;

        this.clock_update(this.s.p);
    }

    accept(p) {
        console.log("accept", this.current_time, p);
        console.log(this.root_dist(p));
        if (this.root_dist(p) > CONST.MAXDIST + CONST.PHI * LOG2D(this.s.poll)) return false;

        if (p.reach === 0) return false;

        return true;
    }

    root_dist(p) {
        console.log("root_dist", this.current_time, p);
        return (Math.max(CONST.MINDISP, p.root_delay + p.delay) / 2. + p.root_disp + p.disp + CONST.PHI * (this.c.t - p.t) + p.jitter);
    }

    clock_update(p) {
        console.log("clock_update", this.current_time, p);
        let dtemp;

        if (this.s.t >= p.t) return;

        this.s.t = p.t;
        this.clock_combine();

        switch (this.local_clock(p, this.s.offset)) {
            case CONST.PANIC:
                console.error("panic !!! ");
                return;

            case CONST.STEP:
                this.clear(p, CONST.X_STEP);
                this.s.poll = CONST.MINPOLL;
                break;

            case CONST.SLEW:
                this.s.leap = p.leap;
                this.s.refid = p.refid;
                this.s.reftime = p.reftime;
                this.s.root_delay = p.root_delay;
                dtemp = Math.sqrt(p.jitter ** 2.0 + this.s.jitter ** 2.0);
                dtemp += Math.max(p.disp + CONST.PHI * (this.c.t - p.t) + Math.abs(p.offset), CONST.MINDISP);
                this.s.root_disp = p.root_disp + dtemp;
                break;

            case CONST.IGNORE:
                break;
        }
    }

    clock_combine() {
        console.log("clock_combine", this.current_time);

        let p = new P();

        let x, y = 0, z = 0, w = 0;
        let i;

        for (i = 0; i < 3; i++) {
            p = this.s.v[i].p;
            x = this.root_dist(p);
            y += 1 / x;
            z += p.offset / x;
            w += (p.offset - this.s.v[0].p.offset) ** 2.0 / x;
        }

        console.log("z",z, "y",y,"w",w);
        this.s.offset = z / y;
        this.s.jitter = Math.sqrt(w / y);

    }

    local_clock(p, offset) {
        console.log("local_clock", this.current_time, p, offset);
        let state, freq, mu, rval, etemp, dtemp;

        if (Math.abs(offset) > CONST.PANICT) return CONST.PANIC;

        rval = CONST.SLEW;
        mu = p.t - this.s.t;
        freq = 0;
        if (Math.abs(offset) > CONST.STEPT) {
            // noinspection FallThroughInSwitchStatementJS
            switch (this.c.state) {
                case CONST.SYNC:
                    state = CONST.SPIK;
                    return rval;
                case CONST.FREQ:
                    if (mu < CONST.WATCH) return CONST.IGNORE;
                    freq = (offset - this.c.base - this.c.offset) / mu;
                    if (mu < CONST.WATCH) return CONST.IGNORE;
                default:
                    this.tolerance = offset;
                    this.c.count = 0;
                    rval = CONST.STEP;
                    if (state === CONST.NSET) {
                        this.rstclock(CONST.FREQ, p.t, 0);
                        return rval;
                    }
                    break;
            }
            this.rstclock(CONST.SYNC, p.t, 0);
        } else {
            etemp = this.c.jitter * this.c.jitter;
            dtemp = (Math.max(Math.abs(offset - this.c.last), LOG2D(this.s.precision))) ** 2.0;
            this.c.jitter = Math.sqrt(etemp + (dtemp - etemp) / CONST.AVG);

            switch (this.c.state) {
                case CONST.NSET:
                    this.c.offset = offset;
                    this.rstclock(CONST.FREQ, p.t, offset);
                    return CONST.IGNORE;

                case CONST.FSET:
                    this.c.offset = offset;
                    break;

                case CONST.FREQ:
                    if (this.c.t - this.s.t < CONST.WATCH) return CONST.IGNORE;
                    freq = (offset - this.c.base - this.c.offset) / mu;
                    break;

                default:
                    if (LOG2D(this.s.poll) > CONST.ALLAN / 2.0) {
                        etemp = CONST.FLL - this.s.poll;
                        if (etemp > CONST.AVG) etemp = CONST.AVG;
                        freq += (offset - this.c.offset) / (Math.max(mu, CONST.ALLAN) * etemp);
                    }

                    etemp = Math.min(mu, LOG2D(this.s.poll));
                    dtemp = 4.0 * CONST.PLL * LOG2D(this.s.poll);
                    freq += offset * etemp / (dtemp * dtemp);
                    break;
            }

            this.rstclock(CONST.SYNC, p.t, offset)
        }

        freq += this.c.freq;
        this.c.freq = Math.max(Math.min(CONST.MAXFREQ, freq), -CONST.MAXFREQ);
        etemp = this.c.wander ** 2.0;
        dtemp = freq ** 2.0;
        this.c.wander = Math.sqrt(etemp + (dtemp - etemp) / CONST.AVG);

        if (Math.abs(this.c.offset) < CONST.PGATE * this.c.jitter) {
            this.c.count += this.s.poll;
            if (this.c.count > CONST.LIMIT) {
                this.c.count = CONST.LIMIT;
                if (this.s.poll < CONST.MAXPOLL) {
                    this.c.count = 0;
                    this.s.poll++;
                }
            }
        } else {
            this.c.count -= this.s.poll << 1;
            if (this.c.count < -CONST.LIMIT) {
                this.c.count = -CONST.LIMIT;
                if (this.s.poll > CONST.MINPOLL) {
                    this.c.count = 0;
                    this.s.poll--;
                }
            }
        }
        return rval;
    }

    rstclock(state, offset, t) {
        console.log("rst_clock", this.current_time, state, offset, t);
        this.c.state = state;
        this.c.base = offset - this.c.offset;
        this.c.last = offset;
        this.c.offset = offset;
        this.s.t = t;
    }

    clear(p, kiss) {
        console.log("clear", this.current_time, p, kiss);
        if (this.s.p === p) this.s.p = null;

        if (kiss !== CONST.X_INIT) {
            p = null;
            return;
        }

        p.leap = CONST.NOSYNC;
        p.ppoll = CONST.MAXPOLL;
        p.hpoll = CONST.MINPOLL;
        p.disp = CONST.MAXDISP;
        p.jitter = LOG2D(this.s.precision);
        p.refid = kiss;

        for (let i = 0; i < CONST.NSTAGE; i++) p.f[i].disp = CONST.MAXDISP;

        p.last = p.t = this.c.t;
        p.next = p.last + (Math.random() & ((1 << CONST.MINPOLL) - 1));
    }

    clock_adjust() {
        console.log("clock_adjust", this.current_time);
        let dtemp;
        this.c.t++;
        this.s.root_disp += CONST.PHI;

        console.log(LOG2D(this.s.poll), "---------------");

        dtemp = this.c.offset / (CONST.PLL * Math.min(LOG2D(this.s.poll), CONST.ALLAN));
        this.c.offset -= dtemp;

        this.adjust_time(this.c.freq + dtemp);
        if (this.c.t >= this.p.next) this.poll(this.p);
    }

    poll(p) {
        console.log('poll', this.current_time, p);
        let oreach;
        let hpoll = p.hpoll;
        if (p.mode === CONST.M_BCST) {
            p.last = this.c.t;
            if (this.s.p != null) this.peer_xmit(p);
            this.poll_update(p, hpoll);
            return;
        }
        if (p.burst == 0) {
            p.last = this.c.t;
            oreach = p.reach;
            p.reach << 1;
            if (!p.reach) {
                if (p.unreach === 0) {
                    p.burst = CONST.BCOUNT;
                } else if (p.unreach < CONST.UNREACH) {
                    p.unreach++;
                } else {
                    hpoll++
                }
            } else {
                p.unreach = 0;
                if (!(p.reach & 0x7)) {
                    this.clock_filter(p, 0, 0, CONST.MAXDISP);
                    hpoll = this.s.poll;
                    if (this.accept(p)) p.burst = CONST.BCOUNT;
                }
            }
        } else {
            p.burst--;
        }

        if (p.mode != CONST.M_BCLN) this.peer_xmit(p);
        this.poll_update(p, hpoll);
    }

    poll_update(p, hpoll) {
        console.log("poll_update", this.current_time, p, hpoll);
        let poll = 0;
        p.hpoll = Math.min(CONST.MAXPOLL, Math.max(CONST.MINPOLL, hpoll));

        if (p.burst !== 0) {
            if (this.c.t !== p.next) return;
            p.next += CONST.BTIME;
        } else {
            poll = Math.min(p.hpoll, Math.max(CONST.MINPOLL, p.ppoll));
            p.next = p.last + (1 << poll);
        }

        if (p.next <= this.c.t) p.next = this.c.t + 1;
    }

    peer_xmit(p) {
        console.log("peer_xmit", this.current_time, p);
        let x = new X();

        x.mode = p.mode;
        x.poll = p.hpoll;
        x.precision = this.s.precision;
        x.root_delay = this.s.root_delay;
        x.root_disp = this.s.root_disp;
        x.refid = this.s.refid;
        x.reftime = this.s.reftime;
        x.org = p.org;
        x.rec = p.rec;
        x.xmt = this.current_time;
        p.xmt = x.xmt;

        this.xmit_packet(x);
    }

    xmit_packet(x) {
        console.log("xmit_packet", this.current_time, x);
        this.messenger.requestTime(x);
    }

    messageReceived(data) {
        switch (data.action) {
            case "sync_time":
                console.log('receive', data);
                let _data = data;
                _data.dst = this.current_time;
                this.receive(_data);
                break;
        }
    }
}