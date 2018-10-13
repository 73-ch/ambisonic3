import platform from 'platform'

export default class {
    constructor() {
        if (platform.os.family === 'iOS' && platform.name === 'Safari') {
            this.iosSafari();
        } else if (platform.os.family === 'Android') {
            this.android();
        }
    }

    iosSafari() {
        this.iosWebApp();
    }

    iosWebApp() {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';
        document.head.appendChild(viewport);

        const capable = document.createElement('meta');
        capable.name = 'apple-mobile-web-app-capable';
        capable.content = 'yes';
        document.head.appendChild(capable);

        const status_bar = document.createElement('meta');
        status_bar.name = 'apple-mobile-web-app-status-bar-style';
        status_bar.content = 'black-translucent';
        document.head.appendChild(status_bar);
    }

    android(){
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        document.head.appendChild(viewport);
    }
}