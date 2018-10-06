import QueryString from 'query-string'

const getDistance = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2.0) + Math.pow(a[1] - b[1], 2.0) + Math.pow(a[2] - b[2], 2.0));
};

const convertPositionFromQueryString = (q_string) => {
    return isNaN(q_string) ? 0.0 : parseFloat(q_string);
};

export default class {
    constructor() {
        this.position = [0, 0, 0];

        this.query = QueryString.parse(location.search);

        this.manual_enabled = false;
        if (this.query.manual_position) this.activeManualPosition();
    }

    setPosition(_position) {
        this.position = _position
    }

    getPositionFromQuery() {
        this.position[0] = convertPositionFromQueryString(this.query.x);
        this.position[1] = convertPositionFromQueryString(this.query.y);
        this.position[2] = convertPositionFromQueryString(this.query.z);

        console.log(this.position);
    }

    getDistance(_position) {
        return getDistance(this.position, _position);
    }

    activeManualPosition() {
        this.active_enabled = true;

        const listener_wrapper = document.querySelector(".listener-pos");
        listener_wrapper.style.display = 'block';

        this.listener_x = document.querySelector(".listener-x");
        this.listener_y = document.querySelector(".listener-y");
        this.listener_z = document.querySelector(".listener-z");

        this.listener_x.value = parseFloat(this.query.x) | 0.0;
        this.listener_y.value = parseFloat(this.query.y) | 0.0;
        this.listener_z.value = parseFloat(this.query.z) | 0.0;


        this.listener_x.addEventListener("change", () => {
            this.moveListener();
        });
        this.listener_y.addEventListener("change", () => {
            this.moveListener();
        });
        this.listener_z.addEventListener("change", () => {
            this.moveListener();
        });
    }

    moveListener() {
        console.log("listener_position", this.listener_x.value, this.listener_y.value, this.listener_z.value);
        this.position = [parseFloat(this.listener_x.value), parseFloat(this.listener_y.value), parseFloat(this.listener_z.value)];
    }
}


