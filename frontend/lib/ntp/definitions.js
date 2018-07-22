export const VERSION =  4; /* version number */
export const PORT = 123; /* NTP port number */
export const MINDISP = .01; /* % minimum dispersion (s) */
export const MAXDISP = 16; /* % maximum dispersion (s) */
export const MAXDIST = 1; /* % distance threshold (s) */
export const NOSYNC = 3; /* leap unsync */
export const MAXSTRAT = 16; /* maximum stratum (infinity metric) */
export const MINPOLL = 4; /* % minimum poll interval (64 s)*/
export const MAXPOLL = 17; /* % maximum poll interval (36.4 h) */
export const PHI = 15e-6; /* % frequency tolerance (15 PPM) */
export const NSTAGE = 8; /* clock register stages */
export const NMAX = 50; /* % maximum number of peers */
export const NSANE = 1; /* % minimum intersection survivors */
export const NMIN = 3; /* % minimum cluster survivors */

export const TRUE = 1; /* boolean true */
export const FALSE = 0; /* boolean false */
export const NULL = 0; /* empty pointer */

export const IGNORE = 0; /* ignore */
export const SLEW = 1; /* slew adjustment */
export const STEP = 2; /* step adjustment */
export const PANIC = 3; /* panic - no adjustment */

export const S_FLAGS = 0; /* any system flags */
export const S_BCSTENAB = 0x1; /* enable broadcast client */

export const P_FLAGS = 0; /* any peer flags */
export const P_EPHEM = 0x01; /* association is ephemeral */
export const P_BURST = 0x02; /* burst enable */
export const P_IBURST = 0x04; /* intial burst enable */
export const P_NOTRUST = 0x08; /* authenticated access */
export const P_NOPEER = 0x10; /* authenticated mobilization */

export const A_NONE = 0; /* no authentication */
export const A_OK = 1; /* authentication OK */
export const A_ERROR = 2; /* authentication error */
export const A_CRYPTO = 3; /* crypto-NAK */

export const X_INIT = 0; /* initialization */
export const X_STALE = 1; /* timeout */
export const X_STEP = 2; /* time step */
export const X_ERROR = 3; /* authentication error */
export const X_CRYPTO = 4; /* crypto-NAK received */
export const X_NKEY = 5; /* untrusted key */

export const M_RSVD = 0; /* reserved */
export const M_SACT = 1; /* symmetric active */
export const M_PASV = 2; /* symmetric passive */
export const M_CLNT = 3; /* client */
export const M_SERV = 4; /* server */
export const M_BCST = 5; /* broadcast server */
export const M_BCLN = 6; /* broadcast client */

export const NSET = 0; /* clock never set */
export const FSET = 1; /* frequency set from file */
export const SPIK = 2; /* spike detected */
export const FREQ = 3; /* frequency mode */
export const SYNC = 4; /* clock synchronized */

export const CHECK = true;
export const PRECISION = -18;

export const SGATE = 3;

export const STEPT = .128;
export const WATCH = 900;
export const PANICT = 1000;
export const PLL = 65536;
export const FLL = MAXPOLL + 1;
export const AVG = 4;
export const ALLAN = 1500;
export const LIMIT = 30;
export const MAXFREQ = 500e-6;
export const PGATE = 4;


export const UNREACH = 12;
export const BCOUNT = 8;
export const BTIME = 2;