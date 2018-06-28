import Home from "../components/home/home.js"
import Controller from "../components/control/control"
import MicCheck from "../components/mic_check/mic_check"

document.addEventListener( 'DOMContentLoaded', function() {
    const current_path = document.querySelector('#current_path').textContent;
    console.log(current_path);
    if (current_path.match("/home")) {
        const home = new Home();
    } else if (current_path.match("/control")) {
        const controller = new Controller();
    } else if (current_path.match("/mic_check")) {
        const mic_check = new MicCheck();
    }
});