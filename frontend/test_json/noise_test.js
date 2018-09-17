this.noise_player.generateLowpassFilter();
this.noise_player.generateNoiseOscillator();
this.noise_player.lowpass_filter.connect(this.nodes["gain"]);
this.noise_player.noise_osc.connect(this.noise_player.lowpass_filter);

this.moveNoise();

{
    "audio_nodes": [
    {
        "name": "gain",
        "node_type": "gain",
        "out": "destination",
        "params": {
            "gain": 0.3
        }
    }
]
}