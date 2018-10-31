
const createUniqueHash = () => {
    return (Math.floor((Math.random() + 5.) ** 20.)).toString(16);
};

const AudioToolKit = class {
    constructor(_context, _generator,_time_sync) {
        this.context = _context;
        this.generator = _generator;
        this.time_sync = _time_sync
    }

    playLoadedSource(node_params, time) {
        if (!node_params.params.buffer in this.generator.stuck_buffer.loaded_buffers) console.error("buffer does not found");

        this.generator.createBufferSource(node_params);

        this.generator.connectAudioNode(node_params);

        this.generator.nodes[node_params.name].start(time);
    }

    playGlitch(out, time) {
        if (Math.random() > 0.25) return;

        const tmp_name = createUniqueHash();

        const s_num = Math.floor(Math.random() * 8);

        const audio_node_params = {
            "name": tmp_name,
            "node_type": "buffer_source",
            "out": out,
            "params": {
                "buffer": "00" + s_num,
                "loop": false
            }
        };

        this.playLoadedSource(audio_node_params, time);
    }

    createOdd() {
        return Math.floor(Math.random()*15)*2+1;
    }
};
export default AudioToolKit