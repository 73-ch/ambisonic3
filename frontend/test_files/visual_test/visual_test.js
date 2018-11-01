
// if (this.intervals.change_color) {
//     clearInterval(this.intervals.change_color);
// }

// this.intervals.change_color = setInterval(()=> {
//     this.visualizer.addColor([Math.random(),Math.random(),Math.random(),Math.random()], [-0.05 * Math.random(),-0.05 * Math.random(),-0.05 * Math.random()]);
// }, 100);

// !location.reload();

this.graphic_manager.scene.addColor([1.0,0.0,0.0, 0.5], [0.000000025,0.,0.]);
this.graphic_manager.scene.addColor([0.,1.0,0., 0.5], [0.,0.025,0.]);

// !this.visualizer.clearColor();