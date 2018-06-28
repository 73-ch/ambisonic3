export default class {
    constructor (context = new AudioContext()) {
        this.context = context;
        navigator.mediaDevices.getUserMedia({audio : true, video: false}).then((stream) => {
            console.log(stream);
            this.input = this.context.createMediaStreamSource(stream);

            console.log(this.input);

            this.input.connect(this.context.destination);
        });
    }
}