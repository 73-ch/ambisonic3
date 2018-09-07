// ある連番のファイルの中から

export default class U {
    constructor() {

    }


}

export function playGlitch(source_num, out) {

    const tmp_name = createUniqueHash();

    const audio_node_params = {
        "name": tmp_name,
        "node_type": "buffer_source",
        "out": out,
        "params": {
            "buffer": "",
            "loop": false
        }

    };


}

export function playAudioFile(node_params, time) {

    this.generator.createBufferSource(node_params);

    this.nodes[node_params.name].start(time);
}

export function getAudioTime(_time) {
    return this.context.currentTime + (_time - this.time_sync.current_time) * 0.001;
}


const createUniqueHash = () => {
    return (Math.floor((Math.random() + 5.) ** 20.)).toString(16);
};
