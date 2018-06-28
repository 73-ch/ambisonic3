export default class {
    constructor (context = new AudioContext()) {
        this.context = context;
        navigator.mediaDevices.getUserMedia({audio : true, video: false}).then((stream) => {
            console.log(stream);
            this.input = this.context.createMediaStreamSource(stream);

            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 1024;

            this.input.connect(this.context.destination);
            this.input.connect(this.analyser);

            console.log(this.analyser);

            setInterval(() => {
                let data = new Uint8Array(1024);

                this.analyser.getByteTimeDomainData(data);

                console.log(data);
            }, 100);
        });
    }
}