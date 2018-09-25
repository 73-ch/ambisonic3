this.intervals.update = setInterval(() => {
    let position = [Math.sin(this.time_sync.current_time * 0.001) * 3, 0, 0];
    let distance = this.position_manager.getDistance(position);

    this.nodes["gain"].value = 1.0 - distance;
}, 10);


