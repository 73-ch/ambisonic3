import * as CONST from "./definitions";

export class F {
    constructor() {
        this.t = 0;
        this.offset = .0;
        this.delay = .0;
        this.disp = .0;
    }
}

export class P {
    constructor() {
        this.mode = "";
        this.leap = "";
        this.stratum = "";
        this.ppoll = "";
        this.root_delay = .0;
        this.root_disp = .0;
        // this.refid = "";
        this.refttime = 0;
        this.org = 0;
        this.rec = 0;
        this.xmt = 0;

        this.t = 0.0;

        this.f = Array(CONST.NSTAGE);
        for (let i = 0; i < CONST.NSTAGE; i++) this.f[i] = new F();

        this.offset = .0;
        this.delay = .0;
        this.disp = .0;
        this.jitter = .0;

        this.hpoll = "";
        this.burst = 0;
        this.reach = 0;
        this.unreach = 0;
        this.last = 0;
        this.next = 0;
    }
}

export class C {
    constructor() {
        this.t = 0;
        this.state = 0;
        this.offset = 0.0;
        this.base = 0.0;
        this.last = 0.0;
        this.count = 0;
        this.freq = 0.0;
        this.jitter = 0.0;
        this.wander = 0.0;
    }
}

export class M {
    constructor() {
        this.p = new P();
        this.type = 0;
        this.edge = 0.0;
    }
}

export class V {
    constructor() {
        this.p = new P();
        this.metric = 0.0;
    }
}

export class S {
    constructor() {
        this.t = 0; // update time
        this.leap = "";
        this.poll = "";
        this.precision = "";
        this.root_delay = 0.0;
        this.root_disp = 0.0;
        // this.refid = "";
        this.reftime = "";
        this.m = Array(CONST.NMAX);
        this.v = Array(CONST.NMAX);
        for (let i = 0; i < CONST.NMAX; i++) {
            this.m[i] = new M();
            this.v[i] = new V();
        }
        this.p = new P();
        this.offset = 0.0;
        this.jitter = 0.0;
        this.flags = 0;
    }
}

export class X {
    constructor() {
        this.action = "";

        this.leap = "";
        this.mode = "";
        this.poll = "";
        this.precision = "";
        this.root_delay = 0;
        this.root_disp = 0;
        // this.refid = "";
        this.reftime = 0;
        this.org = 0;
        this.rec = 0;
        this.xmt = 0;
    }
}

