import home_init from "components/home/home"
import Controller from "components/control/control"

document.addEventListener( 'DOMContentLoaded', function() {
    const current_path = document.querySelector('#current_path').textContent;
    console.log(current_path);
    if (current_path.match("/home")) {
        home_init();
    } else if (current_path.match("/control")) {
        const controller = new Controller();
    }
});