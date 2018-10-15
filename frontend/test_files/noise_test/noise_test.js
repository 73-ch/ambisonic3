this.noise_player.generateLowpassFilter();
this.noise_player.generateNoiseOscillator();
this.noise_player.lowpass_filter.connect(this.nodes["gain"]);
this.noise_player.noise_osc.connect(this.noise_player.lowpass_filter);
this.noise_player.setPosition(this.position_manager.position);

this.noise_player.move();