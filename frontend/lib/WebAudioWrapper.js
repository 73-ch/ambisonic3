import platform from "platform";

export default class {
    constructor(_context) {
        this.context = _context;
        this.loaded_buffers = {};

        this.set_decodeAudioData();
    }

    // safariでdecodeAudioDataがPromiseを返さないのを吸収するためのコード
    set_decodeAudioData() {
        if (platform.name === 'Safari' || platform.os.family === 'iOS') {
            this.context._decodeAudioData = (data) => {
                return new Promise(resolve => {
                    this.context.decodeAudioData(data, (buffer) => {
                        resolve(buffer);
                    });
                });
            }
        } else {
            this.context._decodeAudioData = this.context.decodeAudioData;
        }
    }

    async loadFiles(file_paths) {
        let loadings = [];

        for (let file of file_paths) {
            loadings.push(this.loadFile(file));
        }

        console.log(loadings);

        let values = await Promise.all(loadings).catch((e) => console.error(e));

        for (let v of values) {
            if (v.name && v.buffer) {
                this.loaded_buffers[v.name] = v.buffer;
            } else {
                console.error(v);
            }
        }
        return true;
    }

    async loadFile(file_path) {
        try {
            let name = getFileName(file_path);

            let buffer = await fetchArrayBuffer(file_path);
            buffer = await this.context._decodeAudioData(buffer);;

            return {"name": name, "buffer": buffer};
        } catch (e) {
            // console.errr(e);
            // return e;
            return new Error(`loading failed at ${file_path}`);
        }
    }

    createBufferSourceFromBufferName(name) {
        let source = this.context.createBufferSource();

        source.buffer = this.loaded_buffers[name];

        return source;
    }

    deleteLoadedBuffer(name) {
        try {
            delete this.loaded_buffers[name]
        } catch (e) {
            console.error(`${name} does not exist in loaded buffers.`);
        }

    }
}

const fetchArrayBuffer = async path => {
    let response = await fetch(path);
    return await response.arrayBuffer();
};

const getFileName = (file_path) => {
    return file_path.match(/([^/]+?)?$/)[0];
};