import "./home.css"
import {sayHello, setCallback} from "../../client/sync";

(function () {
    setCallback((msg) => {
        console.log("msg received", msg);
    });

    setTimeout(sayHello, 1000);
})();